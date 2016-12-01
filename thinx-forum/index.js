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
    moment = require('moment');

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
// GET REQUESTS
// =============

// GET route to show all users in Json
app.get('/users', function(req, res){
  User.find().then(function(users){
    res.send(users);
  });
});

app.get('/users/posts', function(req, res){
  var currentUser = req.cookies.loggedinId;
  var postList = [];
  User.findOne({'_id' : currentUser}, 'posts', function(err, user){
    var username = user.username;
    for(var i = 0; i<user.posts.length; i++){
      var postTitle = user.posts[i].title;
      var postTime = user.posts[i].created_at;
      var postContent = user.posts[i].content;
      var postId = user.posts[i]._id;
      postList.push(postId);
      postList.push(postContent);
      postList.push(postTitle);
      postList.push(postTime);
    };
  res.send(postList);
  });
});

app.get('/users/allPosts', function(req, res){
  var postList = [];
  User.find().then(function(user){
    for (var i = 0; i < user.length; i++) {
      var content = user[i].posts;
      var username = user[i].username;
      for (var e = 0; e < content.length; e++) {
        postList.push(content[e]._id);
        postList.push(content[e].content);
        postList.push(content[e].title);
        postList.push(content[e].created_at);
      };
    };
    console.log(postList.length);
    res.send(postList);
  });
});

app.get('/users/content', function(req, res){
  var postList = [];
  User.find().then(function(user){
    for (var i = 0; i < user.length; i++) {
        var content = user[i].posts
      for (var e = 0; e < content.length; e++) {
        postList.push(content[e].content);
      };
    };
    res.send(postList);
  });
});

app.get('/users/onepost', function(req, res){
  var postList = [];
  User.find().then(function(user){
    for (var i = user.length-1; i >= 0; i--) {
      var content = user[i].posts;
      var username = user[i].username;
      var userId = user[i]._id;
      for (var e = content.length-1; e >= 0; e--) {
        var singlePost = {
        userId: userId,
        postId: content[e]._id,
        content: content[e].content,
        title: content[e].title,
        date: content[e].created_at};
        postList.push(singlePost);
      };
    };
    res.send(postList);
  });
});

app.get('/post/comments', function(req, res){
  var commentList = [];
  User.find().then(function(user){
    // console.log(user);
    // console.log(user.length);
    for (var i = 0; i < user.length; i++) {
      // console.log("THIS IS ONE USER THING" + user[0]);
      // console.log("THIS IS ONE USER THING" + user[1]);
      // console.log(i);
      var frogs = user[i].posts;
      // console.log(frogs);
      // console.log(frogs.length);
      for (var e = frogs.length-1; e >= 0; e--) {
        // console.log(e);
        var cats = frogs[e].comments;
        var pigs = cats[0];
        // console.log(pigs);

        if (pigs === undefined) {
          // console.log("nope");
          commentList.push("No Comments");
          // console.log(commentList);
        }else{
          // console.log("cool");
          commentList.push(pigs);
          console.log(commentList);
        };
      };
    };
    res.send(commentList);
  });
});
 
// =============
// POST REQUESTS
// =============

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

app.post('/user/post', function(req, res){
  var title = req.body.title;
  // console.log("this is the title" + title);
  var content = req.body.content;
  console.log(content);
  var currentUser = req.cookies.loggedinId;
  var post2 = new Posts({
    // postNumber: 
    creator: currentUser,
    title: title,
    content: content
  });
  User.findOne({'_id' : currentUser}).exec(function(err, user){
    console.log("========" + user);
    user.posts.push(post2);
    user.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.send(user)
        }
    })
    console.log(post2);
  });
});

app.post('/post/comment', function(req, res){
  var content = req.body.content;
  var currentUser = req.cookies.loggedinId;
  var postId = req.body.username;
  var userId = req.body.username2;
  var postPosition = req.body.postPosition; 
  console.log(postPosition);
  var comment2 = new Comments({
    postId: userId,
    creator: currentUser,
    content: content
  });
  User.findOne({'_id' : postId}).exec(function(err, user){
    user.posts[postPosition].comments.push(comment2);
    user.save(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.send(user)
        }
    })
    console.log(comment2);
  });
});

// app.post('/comment/thread', function(req,res){

// });














