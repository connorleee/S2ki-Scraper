const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    date: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    }
})

const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article