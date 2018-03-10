var db = require("../models");

module.exports = function(router) {

    //RENDERING FOR LOGIN PAGE
    router.get("/", function(req, res) {
        res.render("login");
    });

    //RENDERING CLASSES FOR HOMEPAGE
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

    //RENDERING FOR STUDENT VIEW
    router.get("/classStudentview/:username/:classid",function(req,res){
        db.Student.findOne({
            where:{
                username:req.params.username
            },
            include:[db.Homework, 
            {
                model: db.ExistingClass,
                where: {
                    id: req.params.classid
                },
                include: [db.Teacher]
            }]
        }).then(function(dbstudentInfo){
            var studentInfo={
                currentStudent:dbstudentInfo
            }
            // res.json(dbstudentInfo);
            res.render("studentView",studentInfo);
        })
    });
    
    //RENDERING FOR TEACHER VIEW
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

    //RENDERING FOR TEACHER VIEW FOR GRADING
    router.get("/classTeacherview/grading/:username/:classid", function(req,res){
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
                var classInfo={
                    classInfo: dbclass
                }
                res.render("teacherViewGrading", classInfo);
            });
        });
    })
}