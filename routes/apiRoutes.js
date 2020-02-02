// routes/apiRoutes.js

var db = require("../models");

module.exports = function(app) {

    app.get("/articles", function(req, res) {
        db.Article.find({})
		.then(function (dbArticle) {
            res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
    });

    //-----------------------------------------
    app.get("/sarticles", function(req, res) {
        db.Article.find({saved: true})
		.then(function (dbArticle) {
            res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
    });

    //-----------------------------------------
    app.get("/article/:id", function(req, res) {
        db.Article.find({_id: req.params.id})
        .populate("notes")
		.then(function (dbArticle) {
            res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
    });


};
