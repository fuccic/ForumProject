// =============
// REQUIREMENTS
// =============
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    nodeDebugger = require('node-debugger'),
    morgan = require('morgan'),
    md5 = require('md5'),
    cookieParser = require('cookie-parser');

var port = process.env.PORT || 3000;
var app = express();

// =============
// MIDDLEWARE
// =============
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(cookieParser());

// =============
// DATABASE
// =============
mongoose.connect('mongodb://localhost/thinx_forum_db');

// =============
// MODELS
// =============
var User = require('./models/user');
var Posts = require('./models/posts');
var Comments = require('./models/comments');

// =============
// LISTENER
// =============
app.listen(port);

// =============
// ROUTES
// =============

// GET route to show all users in Json
app.get('/users', function(req, res){
  User.find().then(function(users){
    res.send(users);
  });
});



// POST requet used by createUser and userShow functions in app.js. Creates a user. 
app.post('/users', function(req, res){
  password_hash = md5(req.body.password_hash);
  username = req.body.username;
  var user2 = new User({
    password_hash: password_hash,
    username: username
  });
  // var user2 = {
  //   password_hash: password_hash,
  //   username: username
  // };
  User.findOne({'username' : username}).exec(function(err, user){
    // console.log(user2);
    if (user != null && user.username === username) {
        res.statusCode = 409;
        res.send(res.statusCode);
        console.log(res.statusCode);
          }
    else{
      user2.save(function(err) {
        if (err){
          console.log(err);
          res.statusCode = 503;
        }else{
          // console.log(user.username + ' created!');
          //set the cookie!
          res.cookie("loggedinId", user2.id);
          res.send(user2);
        }; 
      }); 
    };
  });
});



// POST request used by signinSubmit and userShow functions in app.js. Allows a user to log in. 
app.post('/users/login', function(req, res){
  // console.log(req.body.username);
	var username = req.body.username;
  var password_hash = md5(req.body.password_hash);
  // console.log(req.body.password_hash);

  // Mongoose query below find the user and compares the password hashed for authentication and sets the cookie. 
  User.findOne({'username' : username}).exec(function(err, user){
    // console.log(user);
    if (user != null && user.password_hash === password_hash) {
      console.log("success");
      res.cookie("loggedinId", user.id);
      res.send(user);
        }
    else{
      res.status(503).send();
    };
  });
});



// app.get('/seed', function(req, res){
//   var user = new User({
//     password_hash: "hello",
//     username: "timmy"
//   });

//   user.save(function(err) {
//     if (err){
//       console.log(err);
//       res.statusCode = 503;
//     }else{
//       console.log(user.username + ' created!');
//       //set the cookie!
//       res.cookie("loggedinId", user.id);
//       res.send(user);
//       console.log('user id: ', user.id);
//     };  
//   });
// });












