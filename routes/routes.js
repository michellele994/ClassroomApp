var db = require("../models");
var express = require("express");
var router = express.Router();

//Routing for HTML
//======================================================================
//login page
router.get("/", function(req, res) {
    res.render("login");
});
//student page view
router.get("/classStudentview/:username/:classid",function(req,res){
    db.ExistingClass.findOne({
        where:{
            id:req.params.classid
        },include:[db.Teacher,{
            model:db.Student,
            where:{
                username:req.params.username
            }
    }]
    }).then(function(dbstudentInfo){
        var studentInfo={
            currentStudent:dbstudentInfo
        }
        //res.json(studentInfo);
        res.render("studentView",studentInfo);
    })
});
//teacher page view
router.get("/classTeacherview/:username/:classid",function(req,res){
    db.ExistingClass.findOne({
        where:{
            id:req.params.classid
        },
        include:[db.Teacher,db.Homework]
    }).then(function(dbclassInfo){
        var classInfo={
            classInfo:dbclassInfo
        }
        //res.json(dbclassInfo);
        res.render("teacherView",classInfo);
    });
});
router.get("/api/classTeacherview/:username/:classid",function(req,res){
    db.ExistingClass.findOne({
        where:{
            id:req.params.classid
        },
        include:[db.Teacher,db.Homework,db.Student]
    }).then(function(dbclassInfo){
        var classInfo={
            classInfo:dbclassInfo
        }
        res.json(dbclassInfo);
    });
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
    db.Student.findAll({ include: [db.ExistingClass, db.Homework] }).then(function(dbusers) {
        res.json(dbusers);
    });
});
//API route for all the classes. CLasses are made purely by teachers. This shows associated homework, teacher, and students
router.get("/api/classes", function(req, res) {
    db.ExistingClass.findAll({ include: [db.Teacher, db.Student, db.Homework]}).then(function(dbclass) {
        res.json(dbclass);
    });
});
//API route for all the homework. Homework are made purely by teachers who belong to the class.
router.get("/api/:classid/homework", function(req, res) {
    db.Homework.findAll({ where: {ExistingClassId: req.params.classid},include: db.Student}).then(function(dbHw) {
        res.json(dbHw);
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
        include: [db.Teacher, db.Student, db.Homework]
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
        include: [db.ExistingClass, db.Homework]
    }).then(function(dbteacher) {
        res.json(dbteacher);
    });
});


router.get("/api/homework/:classid/:hwname", function(req, res) {
    db.Homework.findOne({
        where: {
            homeworkname: req.params.hwname,
            ExistingClassId: req.params.classid
        }
    }).then(function(dbthisHomework)
        {
            res.json(dbthisHomework);
        })
})

router.get("/api/homework/:classid",function(req,res){
    db.Homework.findAll({
        where:{
            ExistingClassId:req.params.classid
        }
    }).then(function(dbHomework) {
        res.json(dbHomework);
    });
});


/*router.post("api/hw/:classid",function(req,res){
    db.AssignedHW.fidnAll({}).then(function(dbHw) {
        res.json(dbHw);
    });
})*/

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

router.post("/api/homework/:classid",function(req,res){
    db.Homework.create(req.body).then(function(dbHw) {
        res.json(dbHw);

    });
})


router.post("/api/assigningHw/:hwname",function(req,res){
    var arrStudents = req.body.students
    db.Homework.findOne({
        where: {
            homeworkname: req.params.hwname
        }
    }).then(function(thisHomework){
        arrStudents.forEach(function(student){
            db.Student.findAll({
                where: {
                    id: student.id
                }
            }).then(function(thisStudent){
                thisHomework.addStudent(thisStudent, { through: { completed: false }});
            });
        });
    })
})

module.exports=router;



