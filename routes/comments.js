var express = require("express");
var router  = express.Router();
var Comment = require("../models/comments")
var Campground = require("../models/campground");
var middleware = require("../middleware")



router.get("/campground/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", err.message)
            res.redirect("back")
        } else {
            res.render("./comments/newComment", {campground: campground});
        }
    })

})

router.get("/campground/:id/comments/:id_comment/edit", middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            Comment.findById(req.params.id_comment, function(err, newCom){
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("back")
                } else {
                     res.render("./comments/edit",{campground: campground, comment: newCom});
                }
            })
        }
    })
})

router.put("/campground/:id/comments/:id_comment", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            var comment = req.body.comment;
            comment.date = new Date();
            Comment.findByIdAndUpdate(req.params.id_comment, comment, function(err, newCom){
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("back");
                } else {
                    req.flash("success", "Comment Updated")
                     res.redirect("/campground/"+req.params.id)
                }
            })
        }
    })
})

router.post("/campground/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            var comment = req.body.comment;
            comment.date = new Date();
            Comment.create(comment, function(err, newCom){
                if(err){
                    req.flash("error", err.message)
                    res.redirect("back");
                } else {
                    newCom.author.id = req.user._id;
                    newCom.author.username = req.user.username;
                    newCom.save();
                    campground.comments.push(newCom);
                    campground.save();
                    req.flash("success", "Comment Posted")
                    res.redirect(".");
                }
            })
        }
    })
})

router.delete("/campground/:id/comments/:id_comment", middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            Comment.findByIdAndRemove(req.params.id_comment, function(err){
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("back");
                } else {
                    req.flash("success", "Comment Deleted")
                     res.redirect("/campground/"+req.params.id)
                }
            })
        }
    })
})





module.exports = router;