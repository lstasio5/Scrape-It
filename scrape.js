var cheerio = require("cheerio");
var axios = require("axios");

// Use axios to search NPR site
axios.get("https://www.npr.org/sections/world/").then(function(response) {

var $ = cheerio.load(response.data);

// Array to hold scraped data
var results = [];

// Scrape all titles with h2 tag, grab text, push to results.  Console log
  $("h2.title").each(function(i, element) {

    var title = $(element).text();

    results.push({
      title: title   
      
    });
  });

  console.log(results);
});
