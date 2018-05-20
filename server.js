// npm packages
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// importing models
var Article = require("./models/Article.js");
var Note = require("./models/note.js");




var PORT = process.env.PORT || 3000;

// Setting up express
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));

// Handlebars set up
app.engine("handlebars", exphbs({defaultLayout: "main",
partialsDir: path.join(__dirname, "/views/layouts/partials")}));
app.set("view engine", "handlebars");

// Setting up mongoose
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoexperiment");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function(){
    console.log("Mongoose connection successful.");
});

// Server connection
app.listen(PORT, function() {
    console.log("App running on 3000");
})

//////////////////////////
//Routes
//////////////////////////
// Home
app.get("/", function(req,res) {
    Article.find({saved: false}, function(error, data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    })
});

// Function to delete all unsaved articles
app.delete("/deleteall", function(req, res) {
Article.deleteMany({ saved: false }, function (err) {
    if(err) {
        res.send(err);
    }
    else {
        res.send();
    }

  })
});


// Scraping articles using cheerio
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


// Route to update a specific article (to saved)

app.post("/articles/save/:id", function(req, res) {
    Article.findOneAndUpdate({_id: req.params.id}, {saved: true})
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

// Route to delete an usaved article

app.delete("/articles/delete/:id", function(req, res) {
    Article.findOneAndRemove({_id: req.params.id})
    .exec(function(err, doc) {
        if(err) {
            console.log(err);
        }
        else {
            res.send(doc);
        }
    })
})

// Route to update a specific article (to 'unsaved')
app.post("/articles/delete/:id", function(req, res) {
    Article.findOneAndUpdate({_id: req.params.id}, {saved: false})
    .exec(function(err, doc) {
        if(err) {
            console.log(err);
        }
        else {
            res.send(doc);
        }
    })
})


// Route to retrieve all saved articles
app.get("/saved", function(req, res) {
    Article.find({saved: true}).populate("notes")
    .exec(function(error, articles) {
        var hbsObject = {
            article: articles
        }
        res.render("saved", hbsObject);
    })
}) 


// Route to save a note
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
            Article.findOneAndUpdate({_id: req.params.id}, {$push: {notes: doc}})
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
    });

// Route to delete a specific note
app.delete("/notes/delete/:note_id/:article_id", function(req, res) {
    Note.findOneAndRemove({_id: req.params.note_id}, function(err) {
        if(err) {
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({_id: req.params.article_id}, {$pull: {notes: req.params.note_id}}) 
            .exec(function(err) {
                if(err) {
                    res.send(err);
                }
                else {
                    res.send();
                }
            });
        }
    })
});


})