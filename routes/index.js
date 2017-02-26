var express = require("express");
var router  = express.Router();
var Comment = require("../models/comments")
var Campground = require("../models/campground");
var passport = require("passport");
var  User = require("../models/user")

router.get("/register", function(req,res){
    res.render("register");
})

router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser , req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message)
            return res.redirect("back");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Account Created")
            res.redirect("back");
        });
    })
})

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "back",
        failureRedirect: "back",
        failureFlash: true,
        successFlash: 'Welcome home'
    }), function(req,res){
});

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "Successfully Logout")
    res.redirect("back");
})

module.exports = router;
