// server.js

var express  = require("express");               
var logger   = require("morgan");                
var mongoose = require("mongoose");              
var exphbs   = require("express-handlebars");    
var axios    = require("axios");                 
var cheerio  = require("cheerio");               
var db       = require("./models");              
var app      = express();                        
var PORT     = process.env.PORT || 3000;         

// Middleware
app.use(logger("dev"));                          
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());                         
app.use(express.static("public"));               

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
   .then(function() {
        app.listen(PORT, function() {
            console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
            );
        });
   });

module.exports = app;
