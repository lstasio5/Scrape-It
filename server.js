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
      // Insert the data in the scrapedData db
      db.scraped.insert({
        title: title,
        link: link,
       
      },
      function(err, inserted) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          // Otherwise, log the inserted data
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