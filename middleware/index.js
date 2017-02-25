var middlewareObj = {};
var Comment = require("../models/comments")
var Campground = require("../models/campground");

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.id_comment, function(err, foundCom){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }
            else if(foundCom.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You are not the comment creator");
                res.redirect("back");
            }
        });
        
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }
            else if(foundCamp.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You are not the campground creator");
                res.redirect("back");
            }
        });
        
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
}


module.exports = middlewareObj;