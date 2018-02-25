var express=require("express");
var router=express.Router();

//homeroute
router.get("/",function(req,res){
    res.render("layouts/main.handlebars");
});


module.exports=router;