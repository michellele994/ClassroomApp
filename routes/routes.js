// Routes
// =============================================================
var db = require("../models");

var express = require("express");
var router = express.Router();
router.get("/", function(req, res) {
    res.render("login");
});
router.get("/api/users", function(req, res) {
    db.User.findAll({ include: [db.MadeClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
router.get("/api/teachers", function(req, res) {
    db.Teacher.findAll({ include: [db.MadeClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
router.get("/api/classes", function(req, res) {
    db.MadeClass.findAll({ include: [db.User] }).then(function(dbclass) {
        res.json(dbclass);
    });
});
router.post("/api/classes", function(req, res) {
    db.MadeClass.create(req.body).then(function(dbclasses) {
      console.log("Class has been created");
        res.json(dbclasses);
    });
});
//posting a new user into the api/users
router.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbusers) {
        res.json(dbusers);
    });
});
router.post("/api/teachers", function(req, res) {
    db.Teacher.create(req.body).then(function(dbteacher) {
        res.json(dbteacher);
    });
});
//checks to see if user exists
router.get("/api/users/:username/", function(req, res) {
    db.User.findOne({
        where: {
            username: req.params.username
        },
        include: [db.MadeClass]
    }).then(function(dbuser) {
        res.json(dbuser);
    });
});
router.get("/api/teachers/:username/", function(req, res) {
    db.Teacher.findOne({
        where: {
            username: req.params.username
        },
        include: [db.MadeClass]
    }).then(function(dbteacher) {
        res.json(dbteacher);
    });
});

/*//DO NOT WORK TOGETHER SEPARATE
//THIS IS WORKING BY ITSELF
//sending teachers with classes they teach
router.get("/classes/:username/",function(req,res){
  db.User.findOne({
    where:{
      username:req.params.username
    },
    include: [db.Classroom]
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
  db.Classroom.findAll({
     include: [db.User]
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
  db.User.findOne({
    where:{
      username:req.params.username
    },
    include: [db.Classroom]
  }).then(function(dbuser){
    db.Classroom.findAll({
      include: [db.User]
    }).then(function(dbclasses){
      var userLoggedin={
        userInfo:dbuser,
        classInfo:dbclasses
      }
      res.render("classes",userLoggedin);
    });
  });
});*/

//FINDING WHERE ASSOCIATED TEACHER INFO IS NOT EQUAL TO USER
router.get("/classes/:username/",function(req,res){
  db.User.findOne({
    where:{
      username:req.params.username
    },
    include: [db.MadeClass]
  }).then(function(dbuser){
    db.MadeClass.findAll({
      include: [{ 
        model:db.User,
        where:{
            username: {
              $ne: dbuser.username
          }
        }
      }]
    }).then(function(dbclasses){
      var userLoggedin={
        userInfo:dbuser,
        classInfo:dbclasses
      }
      res.render("classes",userLoggedin);
    });
  });
});



module.exports=router;
