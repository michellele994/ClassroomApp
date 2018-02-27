// Routes
// =============================================================
var db = require("../models");

var express=require("express");
var router = express.Router();

//creating the home route
router.get("/",function(req,res){
    res.render("login");
});
router.get("/welcome",function(req,res){
    res.render("classes");
});
//creating the api router
router.get("/api/users", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.userTable.findAll({}).then(function(dbusers) {
      res.json(dbusers);
    });
});
router.post("/api/users", function(req, res) {
  db.userTable.create(req.body).then(function(dbusers) {
    res.json(dbusers);
  });
});

module.exports=router;