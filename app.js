process.env.PWD = process.cwd()

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
var fs = require('fs');
var ejs = require('ejs');

//FOR DASHBOARD
var http = require('http');
var count='';

//create a server object:

http.createServer(function (req, res) {
   //end the response
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('articles', function(err, collection) {
                    collection.count({},function(err, count) {
                       //res.writeHead(200, { 'Content-Type': 'text/html' });
                       //res.write('records= ' + count);
                       //res.end();
                       fs.readFile('dashboard_new.html', 'utf-8', function(err, content) {
                           if (err) {
                             res.end('error occurred');
                             return;
                           }
                           var temp = 'some temp';  //here you assign temp variable with needed value

                           var renderedHtml = ejs.render(content, {count: count});  //get redered HTML code
                           res.end(renderedHtml);
                         });
                    });

        });
    db.collection('articles', function(err, collection) {
                    collection.count({'annotation':'yes'},function(err, annote) {

                    //  res.write('<br>  Total annotations completed= ' + annotationCompleted );//print 0 records
                       //res.end();
                       /*
                       fs.readFile('dashboard.html', 'utf-8', function(err, content) {
                           if (err) {
                             res.end('error occurred');
                             return;
                           }
                           var temp = 'some temp';  //here you assign temp variable with needed value

                           var renderedHtml1 = ejs.render(content, {annotationCompleted: annotationCompleted});  //get redered HTML code
                           res.end(renderedHtml1);
                         });
                         */
                    });
        });

  });

}).listen(8080); //the server object listens on port 8080



//For ANNOTATION Page----------------------------
/*
http.createServer(function (req, res) {
   //end the response
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    fs.readFile('annotate_new.html', 'utf-8', function(err, content) {
        if (err) {
          res.end('error occurred');
          return;
        }
        //var renderedHtml = ejs.render(content, {count: count});  //get redered HTML code
        //res.end(renderedHtml);
        res.end(content)
      });
  });

}).listen(8081); //the server object listens on port 8081
*/
// END OF ANNOTATION PAGE--------------------------


//For NEW ANNOTATION Page----------------------------

http.createServer(function (request, response) {
   //end the response
   var filePath = '.' + request.url;
     if (filePath == './')
         filePath = './annotate_new.html';

     var extname = path.extname(filePath);
     var contentType = 'text/html';
     switch (extname) {
         case '.js':
             contentType = 'text/javascript';
             break;
         case '.css':
             contentType = 'text/css';
             break;
         case '.json':
             contentType = 'application/json';
             break;
         case '.png':
             contentType = 'image/png';
             break;
         case '.jpg':
             contentType = 'image/jpg';
             break;
         case '.wav':
             contentType = 'audio/wav';
             break;
     }

     fs.readFile(filePath, function(error, content) {
         if (error) {
             if(error.code == 'ENOENT'){
                 fs.readFile('./404.html', function(error, content) {
                     response.writeHead(200, { 'Content-Type': contentType });
                     response.end(content, 'utf-8');
                 });
             }
             else {
                 response.writeHead(500);
                 response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                 response.end();
             }
         }
         else {
             response.writeHead(200, { 'Content-Type': contentType });
             response.end(content, 'utf-8');
         }
     });

}).listen(8081); //the server object listens on port 8081

// END OF NEW ANNOTATION PAGE--------------------------


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
app.use(express.static(process.env.PWD + '/public'));

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
  Article.find({completed:{$exists:true}}, function(err, articles){
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

//leaf types
app.get('/leafType', function(req, res){
  Article.find({location:'type2'}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('query_leafType', {
        title:'Leaf Types',
        articles: articles
      });
    }
  });
});

//single types
app.get('/singleLeaf', function(req, res){
  Article.find({single:'yes'}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('query_indLeaf', {
        title:'Single leaves uploaded',
        articles: articles
      });
    }
  });
});

// Query_annotated Route
app.get('/annotated', function(req, res){
  Article.find({annotation:'yes'}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('query_annotated', {
        title:'Annotated Leaves completed',
        articles: articles
      });
    }
  });
});

// Query NOT annotated Route
app.get('/notannotated', function(req, res){
  Article.find({annotation:'no'}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('query_notannotated', {
        title:'Annotation not complete',
        articles: articles
      });
    }
  });
});

// Query My Leaves Route
app.get('/myleaves', function(req, res){
  Article.find({}, function(err, articles){
    Article.find({author:req.user_id}, function(err, articles){
      if(err){
        console.log(err);
      } else {
        res.render('query_myleaves', {
          title:'Leaves annotated by me',
          articles: articles
        });
      }
    });
  });
});

// Query My Leaves Route
app.get('/add_leaf', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('add_leaf', {
        title:'Add Individual leaf',
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
