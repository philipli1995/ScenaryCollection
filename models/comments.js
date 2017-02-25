var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
    content: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: Date
});

module.exports = mongoose.model("comments", commentSchema);