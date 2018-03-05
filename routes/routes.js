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
    db.Teacher.findOne({
        where:{
            username:req.params.username
        },
        include: [db.ExistingClass]
    }).then(function(dbTeacher){
        db.Student.findOne({
            where:{
                username:req.params.username
            },
            include: [db.ExistingClass]
        }).then(function(dbStudent){
            db.User.findOne({
                where:{
                    username:req.params.username
                }
            }).then(function(dbUser){
                var classesTeaching;
                var classesEnrolled;
                if(dbTeacher === null)
                {
                    classesTeaching = null;
                }
                else
                {
                    classesTeaching = dbTeacher.ExistingClasses
                }
                if(dbStudent === null)
                {
                    classesEnrolled = null;
                }
                else
                {
                    classesEnrolled = dbStudent.ExistingClasses
                }

                var userLoggedin={
                    userInfo: dbUser,
                    classesTeaching: classesTeaching,
                    classesEnrolled: classesEnrolled
                    }
                res.render("classes",userLoggedin);
            });
        });
    });
});

//Routing for APIs
//======================================================================

//API route for all existing users. If a user has MadeClass, they are a teacher of those classes. If a user has EnrolledClass, they are a student of those classes.
router.get("/api/users", function(req, res) {
    db.User.findAll({ include: [db.Teacher, db.Student] }).then(function(dbusers) {
        res.json(dbusers);
    });
});

//API route for all teachers including the classes they have made. Teachers are made when a class is made as they are signed in.
router.get("/api/teachers", function(req, res) {
    db.Teacher.findAll({ include: [db.ExistingClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//API route for all students including the classes they have enrolled in. Students are mdae when they enroll into their first class
router.get("/api/students", function(req, res) {
    db.Student.findAll({ include: [db.ExistingClass] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//API route for all the classes. CLasses are made purely by teachers. This shows associated homework, teacher, and students
router.get("/api/classes", function(req, res) {
    db.ExistingClass.findAll({ include: [db.Teacher, db.Student]}).then(function(dbclass) {
        res.json(dbclass);
    });
});
//API route for a single user
router.get("/api/users/:username/", function(req, res) {
    db.User.findOne({
        where: {
            username: req.params.username
        },
        include: [db.Teacher, db.Student]
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
        include: [db.ExistingClass]
    }).then(function(dbteacher) {
        res.json(dbteacher);
    });
});
//API route for a single class
router.get("/api/classes/:classid/", function(req, res) {
    db.ExistingClass.findOne({
        where: {
            id: req.params.classid
        },
        include: [db.Teacher, db.Student]
    }).then(function(dbclass) {
        res.json(dbclass);
    });
});
//API route for a single student
router.get("/api/students/:username/", function(req, res) {
    db.Student.findOne({
        where: {
            username: req.params.username
        },
        include: [db.ExistingClass]
    }).then(function(dbteacher) {
        res.json(dbteacher);
    });
});


//POSTS
//======================================================================
router.post("/api/classes", function(req, res) {
    db.ExistingClass.create(req.body).then(function(dbclasses) {
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
router.post("/api/enrollment/", function(req, res) {
    db.ExistingClass.findOne({
        where: {
            id: req.body.classid
        }
    }).then(function(currentClass){
        db.Student.findOne({
            where: {
                username: req.body.username
            }
        }).then(function(currentStudent){
            // console.log(currentStudent);
            // console.log(currentClass);
            currentClass.addStudent(currentStudent);
        })
    });
});

module.exports=router;



