const express = require("express")
const mongojs = require("mongojs")
const logger = require("morgan")
const path = require("path")

const app = express()

const PORT = process.env.PORT || 8080

app.use(logger("dev"))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static("public"))

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

const databaseUrl = "s2ki"
const collections = ["articles"]

const db = mongojs(databaseUrl, collections)

db.on("error", function(error){
    console.log("Database Error:", error)
})



app.listen(PORT, function(){
    console.log("App listening on PORT: " + PORT)
})