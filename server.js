const express = require("express")
const mongoose = require("mongoose")
const logger = require("morgan")
const path = require("path")
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

mongoose.connect("mongodb://localhost/s2kScraper", { useNewUrlParser: true })



app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT)
})