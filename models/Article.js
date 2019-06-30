const mongoose = require("mongoose")

const schema = mongoos.Schema

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
})

const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article