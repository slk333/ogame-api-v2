var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user")

mongoose.connect("mongodb://localhost:27017/main", {
  useNewUrlParser: true
})
var request = require("request")
var parseString = require('xml2js').parseString;
app.use(require("express-session")({
        secret:"Whatever",
  resave:false,
  saveUninitialized:false
        }))
        
app.use(bodyParser.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// var User = mongoose.model("User", User)
// Player.deleteMany({}, function(error) {})





app.get('/', function(req, res) {
  res.render("login.ejs")
});

app.get('/login', function(req, res) {
  res.render("login.ejs")
});
app.post('/login', passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req, res) {
 // res.render("login.ejs")
});


app.get('/register', function(req, res) {
  res.render("register.ejs")
});
app.post('/register', function(req, res) {
 req.body.username
  req.body.password
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if (err){console.log(err)
              res.render("register.ejs")}
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile")
      })
      
    }
  })
});








app.get('/profile',isLoggedIn, function(req, res) {
  res.render("profile.ejs")
});

app.get('/logout', function(req, res) {
  req.logout()
   res.redirect("/login")
});

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
  
  
}

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});