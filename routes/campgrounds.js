var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/createcamp", middleware.isLoggedIn, function(req, res) {
    res.render("./campgrounds/createcamp");
})


router.get("/campground", function(req, res) {
    Campground.find({}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("./campgrounds/campground", {campground:campground});
        }
    })
    
})

router.get("/campground/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            res.render("./campgrounds/camp", {campground:foundCamp});
        }
    });
})

router.get("/campground/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else{
            res.render("./campgrounds/edit", {campground: foundCamp});
        }
    })
});

router.put("/campground/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCamp){
        if(err) {
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            req.flash("success", "Campground Updated")
            res.redirect("/campground/"+req.params.id)
        }
        
    })
})


router.post("/createcamp", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        username: req.user.username,
        id      : req.user._id
    }
     var newCamp = {name:name, image:image, description:desc, author: author};
    Campground.create(newCamp, function(err, newC){
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            req.flash("success", "Campground Created")
            res.redirect("/campground");
        }
    })
});

router.delete("/campground/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else {
            req.flash("success", "Campground Deleted")
            res.redirect("/campground")
        }
        
    })
})


module.exports = router;
