var  mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleModel = new Schema({
    title: {
        type: String,
        required: true
        },
        link: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        saved: {
            type: Boolean,
            default: false
        }
    
})

var Article = mongoose.model("Article", ArticleModel);
module.exports = Article;