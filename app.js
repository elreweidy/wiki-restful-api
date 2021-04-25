const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// ---------------------------------------------------

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/Articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err){
    res.send(foundArticles);
  } else {
    res.send(err);
  }
  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      console.log("successfully saved the new article to the database");
    } else {
      console.log(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      console.log("Successfully deleted all the records");
    }else {
      console.log(err);
    }
 });
});


app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});

// [
//     {
//         "_id": "60843e0986ef295e7e6ad0a0",
//         "title": "REST",
//         "content": "Rest is short for Representational state transfer."
//     },
//     {
//         "_id": "5c139771d79ac8eac11e754a",
//         "title": "API",
//         "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
//     },
//     {
//         "_id": "5c1398aad79ac8eac11e7561",
//         "title": "Bootstrap",
//         "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
//     },
//     {
//         "_id": "5c1398ecd79ac8eac11e7567",
//         "title": "DOM",
//         "content": "The Document Object Model is like an API for interacting with our HTML"
//     },
//     {
//         "_id": "6084a69b35fd8f0de8fcbeac",
//         "title": "ahmed-elrewaidy",
//         "content": "intelligent living being ",
//         "__v": 0
//     }
// ]
