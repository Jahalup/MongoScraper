var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var expresshndbs = require("express-handlebars");


var app = express();

var databaseUrl = "mongoscraper";
var collections = ["scrapedArticles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});








app.listen(3000, function() {
    console.log("App running on port 3000!");
  });