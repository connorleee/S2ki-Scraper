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
    db.Article.find({}).sort({ date: -1 }).then(dbArticle => {
        for (let i = 0; i < dbArticle.length; i++) {
            const e = dbArticle[i];
            e.date = moment(e.date).format("MMM D, YYYY")
        }
        // console.log(dbArticle)
        res.render("index", { articles: dbArticle });
    });
})

app.get("/articles", (req, res) => {
    db.Article.find({}).then(dbArticle => {
        res.json(dbArticle)
    }).catch(err => {
        res.json(err)
    })
})

app.get("/articles/:id", (req, res) => {
    db.Article.find({ _id: req.params.id })
        .populate("Comment")
        .then(dbArticle => {
            res.json(dbArticle)
        })
        .catch(err => {
            res.json(err)
        })
})

app.post("/articles/:id", (req, res) => {
    db.Comment.create(req.body)
        .then(dbComment => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true })
        })
        .then(dbArticle => {
            res.json(dbArticle)
        })
        .catch(err => {
            res.json(err)
        })
})

app.get("/saved", (req, res) => {
    db.Article.find({ saved: "true" }).sort({ date: -1 }).then(savedArticles => {
        for (let i = 0; i < savedArticles.length; i++) {
            const e = savedArticles[i];
            e.date = moment(e.date).format("MMM D, YYYY")
        }

        res.render("index", { articles: savedArticles });
    });
})

app.put("/saved/:id", (req, res) => {

    db.Article.updateOne({_id: req.params.id}, {$set: {saved: true}})
        .then(savedArticle => {
            console.log(savedArticle)
        })
        .catch(err => {
            res.json(err)
        })
})

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
                date = moment(date).format()

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