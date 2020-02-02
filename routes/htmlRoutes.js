// routes/htmlRoutes.js

var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");

//----------------------------------------------------------------------
function writeLog (strg) {
    fs.writeFile("log.txt", strg, function(err) {
        if (err) {
          return console.log("Error writing log file:", err);
        }
        console.log("Lof file updated!");
    });
};
//----------------------------------------------------------------------

module.exports = function(app) {
  
  app.get("/", function(req, res) {
      res.render("index");
  });

  //-----------------------------------------
  app.get("/scrape", function(req, res) {
    axios.get("https://www.reforma.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        let result = {};

		$("a").each(function (i, element) {
            if ( ($(this).text().trim().length > 1) &&
                 ($(this).text().substring(0,1) !== "\n") ){
                if ( result === null ){
                    result.title = $(this).text();
                    result.link  = $(this).attr("href");
                } else {
                    if ( result.link  === $(this).attr("href") ){
                        result.summary = $(this).text();
                        db.Article.create(result)
                        .then(function (dbArticle2) {
                            console.log(dbArticle2);
                        })
                        .catch(function (err2) {
                            console.log(err2);
                        });
                        result = {};
                    } else {
                        result.title = $(this).text();
                        result.link  = $(this).attr("href");
                    };
                };
            };
        });

        res.render("index");
    });
  });

  //-----------------------------------------
  app.get("/clear", function(req, res) {
      db.Article.remove({}, function(err){
          if (err) {
              console.log(err);
          } else {
              db.Note.remove({}, function(err){
                if (err) {
                    console.log(err);
                } else {
                    res.render("index");
                };
              });
          };
      });
  });

  //-----------------------------------------
  app.get("/saveArticle/:id", function(req, res) {
	db.Article.updateOne({ _id: req.params.id }, {$set: {saved:true} })
		.then(function (dbArticle) {
			res.render("savedArts");
		})
		.catch(function (err) {
			console.log(err);
		});
  });

  //-----------------------------------------
  app.get("/savedArts", function(req, res) {
    res.render("savedArts");
  });

  //-----------------------------------------
  app.get("/unsaveArt/:id", function(req, res) {
	db.Article.updateOne({ _id: req.params.id }, {$set: {saved:false} })
		.then(function (dbArticle) {
			res.render("savedArts");
		})
		.catch(function (err) {
			console.log(err);
		});
  });

  //-----------------------------------------
  app.post("/addNote/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function (dbNote) {
        console.log(dbNote);
        return db.Article
        .findOneAndUpdate({ _id: req.params.id }, {$push: {notes: dbNote._id} } )
    })
    .then(function(dbArticle) {
        res.render("savedArts");
    })
    .catch(function (err2) {
        console.log(err2);
    });
  });

  //-----------------------------------------
  app.get("/artNotes/:id", function(req, res) {
    db.Article.find({_id: req.params.id})
    .populate("notes")
    .then(function (dbArticle) {
        res.render("artNotes", dbArticle[0]);
    })
    .catch(function (err) {
        console.log(err);
    });
  });

  //-----------------------------------------
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
