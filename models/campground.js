var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    description: String,
    price: String,
    author: {
        username: String,
        id: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId
        }
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments"
        }
    ]
});



module.exports = mongoose.model("Campground", campgroundSchema);