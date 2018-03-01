// Routes
// =============================================================
var db = require("../models");

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
    // In this case, just db.Post , db.studentTable
    db.classTable.findAll({ include: [db.userTable] }).then(function(dbclass) {
        res.json(dbclass);
    });
});
router.post("/api/classes", function(req, res) {
    db.classTable.create(req.body).then(function(dbclasses) {
      console.log("im creating aclass");
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
//FINDING WHERE ASSOCIATED TEACHER INFO IS NOT EQUAL TO USER
router.get("/classes/:username/",function(req,res){
  db.userTable.findOne({
    where:{
      username:req.params.username
    },
    include: [db.classTable]
  }).then(function(dbuser){
    db.classTable.findAll({
      include: [{ 
        model:db.userTable,
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
//creating the students api
router.get("/api/students", function(req, res) {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.Post
  db.studentTable.findAll({}).then(function(dbstudents) {
      res.json(dbstudents);
  });
});
router.post("/api/students", function(req, res) {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.Post
  db.userTable.create(req.body).then(function(dbstudents) {
    res.json(dbstudents);
  });
});


module.exports=router;