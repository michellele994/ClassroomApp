var db = require("../models");

module.exports = function(router) {
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
    router.post("/api/submitted/:studentuser/:hwid/", function(req,res){
        db.Student.findOne({
            where: {
                username: req.params.studentuser
            },
            include: [db.Homework]
        }).then(function(thisStudent){
            db.Homework.findOne({
                where: {
                    id: req.params.hwid
                }
            }).then(function(thisHomework){
                thisHomework.addStudent(thisStudent, {through: {
                    submitlink: req.body.submitlink,
                    comment: req.body.comment,
                    completed: true
                }})
            });
        })
    })
}