//Pseudo Code

//Set up dependencies
//Set up DB and declare DB name as databaseUrl and declare name of collection
//Use axios to scrape NPR DB and save in Cheerio variable.
//Pull title, link, and summary and insert to collection in Mongo DB
//Display scraped data on html page
//Allow user to comment- add comment to DB entry for that news article

var cheerio = require("cheerio");
var axios = require("axios");

var express = require("express");
var mongojs = require("mongojs");

var app = express();

//DB and config

var databaseUrl = "news";
var collections = ["scraped"];

var db = mongojs(databaseUrl, collections);

// log any errors
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Add 'scrape' to the URL to scrape today's NPR Headlines to Mongo!");
});


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


// Scrape all titles with h2 tag, grab text, push to results.  Console log
  $("h2.title").each(function(i, element) {

    var title = $(element).text();
    var link = $(element).children("a").attr("href");
    //Come back to this to pull summary 
    //var summary = $(element)

    if (title) {
      // Insert data to Mongo "scraped" collection in News
      db.scraped.insert({
        title: title,
        link: link,
       
      },
      function(err, inserted) {
        if (err) {
          //log errors
          console.log(err);
        }
        else {
          console.log(inserted);
        }
      });
    }
  });
});



res.send("Scrape Complete");
res.send(inserted);
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});