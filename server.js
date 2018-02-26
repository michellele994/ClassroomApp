var express = require("express");
var bodyParser = require("body-parser");

// ============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

//set handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// Routes
var routes=require("./routes/html-routes.js");
app.use(routes);
// =============================================================
//require("./routes/html-routes.js")(app);
//require("./routes/user-api-routes.js")(app);
// require("./routes/post-api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});