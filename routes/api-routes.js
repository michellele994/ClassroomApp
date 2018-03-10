var db = require("../models");

module.exports = function(router) {
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
        db.ExistingClass.findAll({ include: [db.Teacher, {model: db.Student,include:[db.Homework]}, db.Homework]}).then(function(dbclass) {
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
            include: [db.Teacher, db.Student, {model: db.Homework, include:[db.Student]}]
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
    //API route for all assignments in a single class
    router.get("/api/homework/:classid",function(req,res){
        db.Homework.findAll({
            where:{
                ExistingClassId:req.params.classid
            }
        }).then(function(dbHomework) {
            res.json(dbHomework);
        });
    });
    //API route for one homework in a classroom
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
    //API route to obtain homework submissions for teacherview.
    router.get("/api/Teacherclassinfo/:hwid",function(req,res){
        db.Student.findAll({
            include:[{
                model:db.Homework,
                where:{
                    id:req.params.hwid
                }
            }]
        }).then(function(dbHwSubmissions){
            var studentsCompleted =[];
            for(var i = 0; i < dbHwSubmissions.length; i++)
            {
                if (dbHwSubmissions[i].Homework[0].AssignedHomework.completed){
                    studentsCompleted.push({
                        name: dbHwSubmissions[i].name,
                        hwlink: dbHwSubmissions[i].Homework[0].AssignedHomework.submitlink
                    });
                }
            }
            res.json(studentsCompleted);
        });
    });
    //API route for a single student and their homework information.
    router.get("/api/Studenthwinfo/:studentid/:hwid",function(req,res){
        db.Student.findOne({
            where:{
                id:req.params.studentid
            },
            include:[{
                model:db.Homework,
                where:{
                    id:req.params.hwid
                }
            }]
        }).then(function(lastSub){
            res.json(lastSub);

        });
    });

    //API Route for Grading purposes
    router.get("/api/classTeacherview/grading/:username/:classid", function(req,res){
        db.Teacher.findOne({
            where:{
                username: req.params.username
            },
            include:[db.ExistingClass]
        }).then(function(dbTeacher) {
            db.ExistingClass.findOne({
                where: {
                    id: req.params.classid
                },
                include: [db.Teacher, db.Student,{
                    model: db.Homework,
                    include:[db.Student]
                }]
            }).then(function(dbclass) {
                res.json(dbclass);
            });
        });
    })
}