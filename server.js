const express = require("express")
const mongoose = require("mongoose")
const logger = require("morgan")
const moment = require("moment")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

const PORT = process.env.PORT || 8080

app.use(logger("dev"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

const db = require("./models")

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/s2kScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/", (req, res) => {
    db.Article.find({}).sort({date: -1}).then(dbArticle => {
        // console.log(dbArticle)
        for (let i = 0; i < dbArticle.length; i++) {
            const e = dbArticle[i];
            console.log(e.date)
            e.date = moment(e.date).format("MMM D, YYYY")
            console.log(e.date)
        }
        
        res.render("index", {articles: dbArticle});
    });
})

app.get("/articles", (req, res) => {
    db.Article.find({}).then(dbArticle => {
        res.json(dbArticle)
    }).catch(err => {
        res.json(err)
    })
})

// Remaining routes
    // post to /saved
    // get /saved
    // post note to Notes
    // get note from Notes

app.post("/saved")

// Scrape route
app.get("/scrape", (req, res) => {
    for (let i = 0; i < 5; i++) {
        axios.get("https://www.s2ki.com/page/" + i).then(response => {
            const $ = cheerio.load(response.data)

            let results = []

            $("article").each((i, element) => {
                const title = $(element).find("h3").find("a").text()
                const summary = $(element).find("section").find("div").find("p").text().trim()
                const link = $(element).find("h3").find("a").attr("href")
                const img = $(element).find("a").find("figure").find("img").attr("src")

                let dateSliceIndex = $(element).find("section").find("div").find("span").text().trim().indexOf("-")
                let date = $(element).find("section").find("div").find("span").text().slice(dateSliceIndex + 2).trim()
                console.log(date)
                date = moment(date).format()
                console.log(date)

                results.push({
                    title: title,
                    summary: summary,
                    link: link,
                    img: img,
                    date: date
                })
            })

            // console.log(results)

            for (let i = 0; i < results.length; i++) {
                const element = results[i];

                db.Article.update(
                    { "title": element.title },
                    {
                        $set: {
                            "title": element.title,
                            "summary": element.summary,
                            "link": element.link,
                            "img": element.img,
                            "date": element.date
                        }
                    },
                    { upsert: true }
                ).then(dbArticle => {
                    console.log(dbArticle)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }
})

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT)
})