var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

var Article = require("./models/Article.js");
var Note = require("./models/note.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main",
partialsDir: path.join(__dirname, "/views/layouts/partials")}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongoexperiment");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function(){
    console.log("Mongoose connection successful.");
});



// Routes

app.get("/", function(req,res) {
    Article.find({"saved": false}, function(error, data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    })
})


app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        $("article").each(function(i, element) {
            var result = {};
            result.image = $(this).find("a").find("img").attr("src");
            result.link = $(this).find("a").attr("href");
            result.title = $(this).find("h2").text().trim();
            result.summary = $(this).find("p.summary").text().trim();
            // result.saved = false;

            var entry = new Article(result);

            entry.save(function(err, doc) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });
        });
        res.send("Scrape was successful");
    })
})


app.get("/articles", function(req,res) {
    Article.find({}, function(error, doc) {
        if(error) {
            console.log(error);
        }

        else {
            res.json(doc);
        }
    })
})

app.listen(PORT, function() {
    console.log("App running on 3000");
})



app.post("/articles/save/:id", function(req, res) {
    Article.findOneAndUpdate({"_id": req.params.id}, {"saved": true})
    .exec(function(err,doc) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("doc: " + doc)
            res.send(doc);
        }
    })
})

app.post("/articles/delete/:id", function(req, res) {
    Article.findOneAndUpdate({"_id": req.params.id}, {"saved": false})
    .exec(function(err, doc) {
        if(err) {
            console.log(err);
        }
        else {
            res.send(doc);
        }
    })
})


app.get("/saved", function(req, res) {
    Article.find({"saved": true}).populate("notes")
    .exec(function(error, articles) {
        var hbsObject = {
            article: articles
        }
        res.render("saved", hbsObject);
    })
}) 






app.post("/notes/save/:id", function(req,res) {
    var newnote = new Note ({
        note: req.body.text,
        article: req.params.id
    })
    newnote.save(function(err, doc) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("note: " + doc);
            Article.findOneAndUpdate({"_id": req.params.id}, {$push: {"notes": doc}})
            .exec(function(err) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    res.send(doc);
                }
            })
        }
    })

})