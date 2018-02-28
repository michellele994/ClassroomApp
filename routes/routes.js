// Routes
// =============================================================
var db = require("../models");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var express = require("express");
var router = express.Router();

//creating the home route
router.get("/", function(req, res) {
    res.render("login");
});
//creating the user/api route
router.get("/api/users", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.userTable.findAll({ include: [db.classTable] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
router.get("/api/classes", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.classTable.findAll({ include: [db.userTable] }).then(function(dbclass) {
        res.json(dbclass);
    });
});
router.post("/api/classes", function(req, res) {
    db.classTable.create(req.body).then(function(dbclasses) {
        res.json(dbclasses);
    });
});
//posting a new user into the api/users
router.post("/api/users", function(req, res) {
    db.userTable.create(req.body).then(function(dbusers) {
        res.json(dbusers);
    });
});

//checks to see if user exists
router.get("/api/users/:username/", function(req, res) {
    db.userTable.findOne({
        where: {
            username: req.params.username
        },
        include: [db.classTable]
    }).then(function(dbuser) {
        res.json(dbuser);
    });
});

/*//DO NOT WORK TOGETHER SEPARATE
//THIS IS WORKING BY ITSELF
//sending teachers with classes they teach
router.get("/classes/:username/",function(req,res){
  db.userTable.findOne({
    where:{
      username:req.params.username
    },
    include: [db.classTable]
  }).then(function(dbuser){
  var userLoggedin={
    userInfo:dbuser
  }
    res.render("classes",userLoggedin);
  });
});

//  WORKS BY ITSELF
//sending all classes that teacher doesn't teach
router.get("/classes/:username/",function(req,res){
  db.classTable.findAll({
     include: [db.userTable]
}).then(function(dbclasses){
  var classesAvail={
    classInfo:dbclasses
  }
    res.render("classes",classesAvail);
  });
});*/

/*//WORKS BY AS IS BUT REQUIRES FOR ME TO WRITE A HANDLEBARS HELPER FUNCTION TO ACCESS WHERE TEACHER IS NOT EQUAL TO USER
//getting the users class information
router.get("/classes/:username/",function(req,res){
  db.userTable.findOne({
    where:{
      username:req.params.username
    },
    include: [db.classTable]
  }).then(function(dbuser){
    db.classTable.findAll({
      include: [db.userTable]
    }).then(function(dbclasses){
      var userLoggedin={
        userInfo:dbuser,
        classInfo:dbclasses
      }
      res.render("classes",userLoggedin);
    });
  });
});*/

//WORKS BY AS IS BUT REQUIRES FOR ME TO WRITE A HANDLEBARS HELPER FUNCTION TO ACCESS WHERE TEACHER IS NOT EQUAL TO USER
//getting the users class information
router.get("/classes/:username/",function(req,res){
  db.userTable.findOne({
    where:{
      username:req.params.username
    },
    include: [db.classTable]
  }).then(function(dbuser){
    db.classTable.findAll({
    }).then(function(dbclasses){
      //this might be able to be replaced so far only way without having to use hbrhelperfunctions and where not equal
      var userLoggedin={
        userInfo:dbuser,
        classInfo:classesAvail(dbcclasses,dbuser.username)
      }
      res.render("classes",userLoggedin);
    });
  });
});


module.exports=router;