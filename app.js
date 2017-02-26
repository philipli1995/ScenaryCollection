var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    User        = require("./models/user"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    Comment     = require("./models/comments");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");


// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "you bet!",
    resave: false,
    saveuninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

 mongoose.connect("mongodb://localhost/yelp_camp");
 
 //mongoose.connect("mongodb://user:19950102@ds161029.mlab.com:61029/web-work");
 
 //  mongodb://user:19950102@ds161029.mlab.com:61029/web-work

app.get("/", function(req, res) {
    res.render("home");
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server starts!");
})

