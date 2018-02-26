/*var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/layouts/login.handlebars"));
  });

  // cms route loads cms.html
  app.get("/thankyou", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/htmlTest/thankyou.html"));
  });

};*/
var express=require("express");
var router = express.Router();
//creating the home route
router.get("/",function(req,res){
        res.render("layouts/login");
    });
module.exports=router;