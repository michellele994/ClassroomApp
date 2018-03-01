var db = require("../models");
var express = require("express");
var router = express.Router();

//Routing for HTML
//======================================================================
router.get("/", function(req, res) {
    res.render("login");
});
// This renders the available classes for enrollment as long as user is not currently a teacher for the class.
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

//Routing for APIs
//======================================================================

//Route for all existing users. If a user has MadeClass, they are a teacher of those classes. If a user has EnrolledClass, they are a student of those classes.
router.get("/api/users", function(req, res) {
    db.User.findAll({ include: [db.MadeClass, db.EnrolledClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});

//Route for all teachers including the classes they have made. Teachers are made when a class is made as they are signed in.
router.get("/api/teachers", function(req, res) {
    db.Teacher.findAll({ include: [db.MadeClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//Route for all students including the classes they have enrolled in. Students are mdae when they enroll into their first class
router.get("/api/students", function(req, res) {
    db.Student.findAll({ include: [db.EnrolledClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//Route for 
router.get("/api/classes", function(req, res) {
    db.MadeClass.findAll({ include: [db.AssignedHW, db.User, db.Student] }).then(function(dbclass) {
        res.json(dbclass);
    });
});
router.get("/api/enrollment", function(req, res) {
    db.EnrolledClass.findAll({ include: [db.Student, db.HomeworkTD] }).then(function(dbenrollment) {
        res.json(dbenrollment);
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
router.post("/api/students", function(req, res) {
    db.Student.create(req.body).then(function(dbusers) {
        res.json(dbusers);
    });
});
router.post("/api/teachers", function(req, res) {
    db.Teacher.create(req.body).then(function(dbteacher) {
        res.json(dbteacher);
    });
});
router.post("/api/enrollment", function(req, res) {
    db.EnrolledClass.create(req.body).then(function(dbenrollment) {
        res.json(dbenrollment);
    });
});
//checks to see if user exists
router.get("/api/users/:username/", function(req, res) {
    db.User.findOne({
        where: {
            username: req.params.username
        },
        include: [db.MadeClass, db.EnrolledClass]
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
router.get("/api/students/:username/", function(req, res) {
    db.Student.findOne({
        where: {
            username: req.params.username
        }
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

//WORKS BY AS IS BUT REQUIRES FOR ME TO WRITE A HANDLEBARS HELPER FUNCTION TO ACCESS WHERE TEACHER IS NOT EQUAL TO USER
//getting the users class information
// router.get("/classes/:username/",function(req,res){
//   db.User.findOne({
//     where:{
//       username:req.params.username
//     },
//     include: [db.MadeClass]
//   }).then(function(dbuser){
//     db.MadeClass.findAll({
//       include: [db.User]
//     }).then(function(dbclasses){
//       var userLoggedin={
//         userInfo:dbuser,
//         classInfo:dbclasses
//       }
//       res.render("classes",userLoggedin);
//     });
//   });
// });

//creating the students api
router.get("/api/students", function(req, res) {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.Post
  db.Student.findAll({}).then(function(dbstudents) {
      res.json(dbstudents);
  });
});
router.post("/api/students", function(req, res) {
  // Here we add an "include" property to our options in our findAll query
  // We set the value to an array of the models we want to include in a left outer join
  // In this case, just db.Post
  db.Student.create(req.body).then(function(dbstudents) {
    res.json(dbstudents);
  });
});


module.exports=router;
