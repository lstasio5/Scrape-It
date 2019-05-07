var cheerio = require("cheerio");
var axios = require("axios");

var express = require("express");
var mongojs = require("mongojs");

var app = express();

var databaseURL = "news";
var collection = ["scrapedNews"];

var db = mongojs(databaseUrl, collections);

// log any errors
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Hello world");
});


// Get data from Mongo DB

app.get("/all", function(req, res) {
// Find all results from the scrapedData collection in the db
db.scrapedData.find({}, function(error, found) {
  // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});


// Use axios to search NPR site and scrape into MongoDB

app.get("/scrape", function(req, res) {

axios.get("https://www.npr.org/sections/world/").then(function(response) {

var $ = cheerio.load(response.data);

// Array to hold scraped data
var results = [];

// Scrape all titles with h2 tag, grab text, push to results.  Console log
  $("h2.title").each(function(i, element) {

    var title = $(element).text();
    //Come back to this to pull summary and URL
    //var summary = $(element)

    db.scrapedData.insert({
      title: title   
      
    });
  });

  console.log(inserted);
});


res.send("Scrape Complete");
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});
