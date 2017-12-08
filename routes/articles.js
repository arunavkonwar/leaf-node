const express = require('express');
const router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: storage });

//add article route
router.post('/add', upload.single('profileImage'), function (req, res) {
    //console.log(req);
    console.log("-----ADD ARTCILE--------");
    console.log(req.file.filename);

    //return res.send(req.files);
    //res.redirect('/articles/add');
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    //req.checkBody('body','Body is required').notEmpty();
    //req.checkBody('location','location is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();
    var file= {filename:req.body.photo};
    if(errors){
      res.render('add_article', {
        title:'Add Leaf Type',
        errors:errors
      });
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.user._id;
      article.body = req.body.body;
      article.location = req.body.location;
      article.country = req.body.country;
      article.photo = req.file.filename;
      article.completed = req.body.completed;
      article.division = req.body.division;
      article.season = req.body.season;
      article.disease = req.body.disease;
      article.description = req.body.description;
      article.place = req.body.place;
      article.annotation = req.body.annotation;
      article.annote_area = req.body.annote_area;
      article.single= req.body.single;

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

//test page
router.get('/test', function (req, res) {
  res.render('test', { title: 'Hey', message: 'Hello there!'});
});


/*
// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  //req.checkBody('body','Body is required').notEmpty();
  //req.checkBody('location','location is required').notEmpty();
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
    article.annotation = req.body.annotation;
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
*/
// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Leaf Type',
      article:article
    });
  });
});


// Load Edit Form
router.get('/editLeaf/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_leaf', {
      title:'Edit Individual Leaf',
      article:article
    });
  });
});


// Update Submit POST Route

router.post('/edit/:id', upload.single('profileImage'), function(req, res){
  let article = {};

  console.log("-----EDIT POST--------");
  //console.log(req.file.filename);

  //console.log(req.body.photo);
  //console.log(req);

  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.location = req.body.location;
  article.country = req.body.country;
  if(req.file){
    article.photo = req.file.filename;
  }
  else {
    req['file']=req.body.photo;
    article.photo = req.body.photo;
  }
  article.completed = req.body.completed;
  article.division = req.body.division;
  article.season = req.body.season;
  article.disease = req.body.disease;
  article.description = req.body.description;
  article.place = req.body.place;
  article.annotation = req.body.annotation;
  article.annote_area = req.body.annote_area;
  article.single= req.body.single;

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
        Article.find({location:article.location,single:"yes"}, function(err, articles){
        res.render('article', {
          article:article,
          author: user.name,
          articles: articles
        });
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
