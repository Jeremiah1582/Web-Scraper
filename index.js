const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(200).json("welcome to my climate change api !");
});

const newsPapers = [
  {
    name: "thetimes",
    keyword: "climate",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "theGuardian",
    keyword: "climate",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "financialtimes",
    keyword: "climate",
    address: "https://www.ft.com/?edition=uk",
    base: "https://www.ft.com",
  },
  {
    name: "BBC",
    keyword: "climate",
    address: "https://www.bbc.com/news/science-environment-56837908",
    base: "https://www.bbc.com",
  },
  {
    name: "cityam",
    keyword: "climate",
    address:
      "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
    base: "",
  },
  {
    name: "thetimes",
    keyword: "climate",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    keyword: "climate",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    keyword: "climate",
    address: "https://www.telegraph.co.uk/climate-change",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nyt",
    keyword: "climate",
    address: "https://www.nytimes.com/international/section/climate",
    base: "",
  },
  {
    name: "latimes",
    keyword: "climate",
    address: "https://www.latimes.com/environment",
    base: "",
  },
  {
    name: "smh",
    keyword: "climate",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    keyword: "climate",
    address: "https://www.un.org/climatechange",
    base: "",
  },
  {
    name: "bbc",
    keyword: "climate",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    keyword: "climate",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    keyword: "climate",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "dm",
    keyword: "climate",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "nyp",
    keyword: "climate",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
];

// this is your first scraping tool-complete

const articles = [];
const specificArticle = [];

app.get("/news", (req, res) => {
  newsPapers.forEach((item) => {
    axios
      .get(`${item.address}`)
      .then((response) => {
        const html = response.data;
        // console.log(html);
        const $ = cheerio.load(html);
        $(`a:contains(${item.keyword})`, html).each(function () {
          //arrow function wont work here
          if (item.base == "") {
            const title = $(this).text();
            const url = $(this).attr("href");
            articles.push({
              title,
              url,
              source: item.name,
            });
          } else if (item.base !== "") {
            const title = $(this).text();
            const url = $(this).attr("href");
            articles.push({
              title,
              url: item.base + url,
              source: item.name,
            });
          }
          res.status(200).json(articles);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.get("/news/:newsId", (req, res) => {
  const newsId = req.params.newsId;
  const newspaperItem = newsPapers.filter((item) => item.name == newsId)[0];
  const npBase = newsPapers.filter((item) => item.name == newsId)[0].base;
  console.log(newspaperItem);
  axios
    .get(newspaperItem.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticle.push({
          title,
          url: npBase + url,
          source: newspaperItem.name,
        });
      });
      res.status(200).json(specificArticle);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log("port is running on ", PORT);
});
