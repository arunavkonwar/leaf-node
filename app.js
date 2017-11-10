const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/leaf-nodekb";

/*
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { title: 'nadal' };
  db.collection("articles").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

*/

//FOR DASHBOARD
var http = require('http');

//create a server object:

  http.createServer(function (req, res) {
     //end the response
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      //var query = { title: 'nadal' };
      /*
      db.collection("articles").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.write('result works'); //write a response to the client
        res.end();
        db.close();
      });
      */

      db.collection('articles', function(err, collection) {
                      collection.count({},function(err, count) {
                         res.write('records= ' + count);//print 0 records
                         //res.end();
                      });
          });
      db.collection('articles', function(err, collection) {
                      collection.count({'annotation':'yes'},function(err, annotationCompleted) {
                         res.write('  Total annotations completed= ' + annotationCompleted);//print 0 records
                         res.end();
                      });
          });

    });

  }).listen(8080); //the server object listens on port 8080




mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Leaves',
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
//with multer
var profile = require('./routes/profile');
app.use('/profile', profile);
//
app.use('/articles', articles);
app.use('/users', users);

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
