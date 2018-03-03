var db = require("../models");
var express = require("express");
var router = express.Router();

//Routing for HTML
//======================================================================
router.get("/", function(req, res) {
    res.render("login");
});
// This renders the available classes for enrollment as long as user is not currently a teacher for the class.
router.get("/welcome/:username/",function(req,res){
    db.User.findOne({
        where:{
            username:req.params.username
        },
        include: [db.MadeClass, db.EnrolledClass]
    }).then(function(dbUser){
        db.MadeClass.findAll({
            include:[{
                model:db.Teacher,
                where:{
                    username:dbUser.username
                }
            }]
        }).then(function(dbclassesTeaching){
            db.MadeClass.findAll({
                include:[{
                    model:db.Student,
                    where:{
                        username:dbUser.username
                    }
                }]
            }).then(function(dbclassesEnrolled){
                var userLoggedin={
                    userInfo:dbUser,
                    classesTeaching:dbclassesTeaching,
                    classesEnrolled:dbclassesEnrolled
                    }
                res.render("classes",userLoggedin);
            });
        });
    });
});


/*//send available classes
=======

//send available classes
>>>>>>> 4222128d806399c5302fab8c8e2419ca09a44ab8
router.get("/welcomeClasses/:username/",function(req,res){
    console.log("im");
    /*db.MadeClass.findAll({
        include:[db.Teacher,db.Student]
    }).then(function(dbClasses){
        console.log(dbClasses[0].classname);
<<<<<<< HEAD
    });
});*/



//Routing for APIs
//======================================================================

//API route for all existing users. If a user has MadeClass, they are a teacher of those classes. If a user has EnrolledClass, they are a student of those classes.
router.get("/api/users", function(req, res) {
    db.User.findAll({ include: [db.MadeClass, db.EnrolledClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});

//API route for all teachers including the classes they have made. Teachers are made when a class is made as they are signed in.
router.get("/api/teachers", function(req, res) {
    db.Teacher.findAll({ include: [db.MadeClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//API route for all students including the classes they have enrolled in. Students are mdae when they enroll into their first class
router.get("/api/students", function(req, res) {
    db.Student.findAll({ include: [db.EnrolledClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//API route for all the classes. CLasses are made purely by teachers. This shows associated homework, teacher, and students
router.get("/api/classes", function(req, res) {
    db.MadeClass.findAll({ include: [db.AssignedHW, db.Teacher, db.Student] }).then(function(dbclass) {
        res.json(dbclass);
    });
});
//API route for all enrollment. Anytime someone enrolls, this is made. This has an associating between Students and Homework
router.get("/api/enrollment", function(req, res) {
    db.EnrolledClass.findAll({ include: [db.Student, db.HomeworkTD] }).then(function(dbenrollment) {
        res.json(dbenrollment);
    });
});
//API route for a single user
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
//API route for a single teacher
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
//API route for a single class
router.get("/api/classes/:classid/", function(req, res) {
    db.MadeClass.findOne({
        where: {
            id: req.params.classid
        },
        include: [db.AssignedHW, db.Teacher, db.Student]
    }).then(function(dbclass) {
        res.json(dbclass);
    });
});
//API route for a single student
router.get("/api/students/:username/", function(req, res) {
    db.Student.findOne({
        where: {
            username: req.params.username
        }
    }).then(function(dbteacher) {
        res.json(dbteacher);
    });
});

//POSTS
//======================================================================
router.post("/api/classes", function(req, res) {
    db.MadeClass.create(req.body).then(function(dbclasses) {
        res.json(dbclasses);
    });
});
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

module.exports=router;
