var db = require("../models");

module.exports = function(app) {
  app.get("/api/users", function(req, res ,cb) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.userTable.findAll({}).then(function(dbusers) {
      res.json(dbusers);
    });
  });
  app.post("/api/users", function(req, res) {
    db.userTable.create(req.body).then(function(dbusers) {
      res.json(dbusers);
    });
  });

  /*//route to see if user exists
  app.get("/api/users/:username/:name",function(req,res){
    db.userTable.findAll({
      where:{
        name:req.params.name,
        username:req.params.username
      }
    }).then(function(dbusers) {
      res.json(dbusers);
    });
  });
  app.post("/api/users/:username/:name", function(req, res) {
    db.userTable.create(req.body).then(function(dbusers) {
      res.json(dbusers);
    });
  });*/

  

};
