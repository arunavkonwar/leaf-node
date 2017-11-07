const express = require('express');
const router = express.Router();

// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add Leaf'
  });
});
//dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res){
  res.render('dashboard', {
    title:'Dashboard'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  req.checkBody('location','location is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Leaf',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    article.location = req.body.location;
    article.country = req.body.country;
    article.photo = req.body.photo;
    article.completed = req.body.completed;
    article.division = req.body.division;
    article.season = req.body.season;
    article.disease = req.body.disease;
    article.description = req.body.description;
    article.place = req.body.place;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        console.log('success');
        res.redirect('/');

      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Leaf',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.scientificName = req.body.scientificName;
  article.author = req.body.author;
  article.body = req.body.body;
  article.location = req.body.location;
  article.country = req.body.country;
  article.photo = req.body.photo;
  article.completed = req.body.completed;
  article.division = req.body.division;
  article.season = req.body.season;
  article.disease = req.body.disease;
  article.description = req.body.description;
  article.place = req.body.place;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article:article,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
