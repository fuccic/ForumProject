
var user = null;

//============
// Grabbers
//============
var $closeButton = $('#close-button');

var $usernameAlert = $('.alert');

var $postButton = $('#create-post');

var $commentButton = $('#create-comment');

var $postHolder = $('#posts-holder');

// var $nameInput = $('#name-input');
// // console.log($nameInput);
// var $usernameAlert = $('.alert');
// console.log($usernameAlert);

$(function(){

	var $signupButton = $('#signup-button');
	// generates signup form on click
	$signupButton.click(function(){
		signUpForm();
	});

	var $signinButton = $('#signin-button');
	// generates signin form on click
	$signinButton.click(function(){
		showSignIn();
	});

	if(Cookies.get('loggedinId') === undefined){
		showSplashPage();
	}else{
		userShow();
	}
});

var showSplashPage = function(){
	$('#username').hide();
	$('#password').hide();
	$('#username-field').hide();
	$('#password-field').hide();
	$('#new-user-submit').hide();
	$('.signin-submit').hide();
	$('#signup-button').show();
	$('#signin-button').show();
};


var signUpForm = function(){
	var formDiv = $('#form-container');
	$('#signup-button').hide();
	$('#signin-button').hide();
	var source = $('#user-signup-template').html();
	var template = Handlebars.compile(source);
	formDiv.append(template());
	$('#new-user-submit').click(function(){
		createUser();
	});
};

var createUser = function(){
	var formDiv = $('#form-container');
	var username = $('#username-field').val();
	var password = $('#password-field').val();
	var userData = {
		username: username,
		password_hash: password
	};
	$.ajax({
		url: "http://localhost:3000/users",
		method: "POST",
		data: userData,
		statusCode: {
      	409: function (response) {
      			console.log("username exists");
      			showAlert();
     		},
     		200: function (response) {
     			console.log(response);
         		userShow();
     		}
     	}
	})
};

var showAlert = function(){
	$usernameAlert.css("display", "block");
}

// 
var userShow = function(data){
	var frontPage = $("#front-page");
	var userPage = $("#user-page");
	frontPage.hide();
	userPage.toggle();
	user = Cookies.get('loggedinId');
	// setTimeout(initMap, 2000);
	$usernameAlert.hide();
	getPosts();
};

// shows user sign in field, on click it runs sign in submit
var showSignIn = function(){
	var formDiv = $('#form-container');
	var source = $('#user-signin-template').html();
	var template = Handlebars.compile(source);
	$('#signup-button').hide();
	$('#signin-button').hide();
	formDiv.append(template());
	$('.signin-submit').click(function(){
		signinSubmit();
		$('#username').val('');
		$('#password').val('');
	});
};

// signs in the user
var signinSubmit = function(){
	var usernameInput = $("#username").val()
	var passwordInput = $("#password").val()
	var user = {
		username: usernameInput,
		password_hash: passwordInput
	};
	$.ajax({
		url: 'http://localhost:3000/users/login',
		method: 'POST',
		data: user,
		statusCode: {
      		503: function (response) {
     		},
     		200: function (response) {
         		userShow();
     		}
    	}
	});
};

var $userButt = $('#user-posts-butt');
$userButt.click(function(){
	$('.posters').remove();
	$('#comment-box').remove();
	$('#commentModal').remove();
	$('.single-post').remove();
	getPostsCurrentUser();
});

var $allButt = $('#all-posts-butt');
$allButt.click(function(){
	$('.posters').remove();
	$('#comment-box').remove();
	$('#commentModal').remove();
	$('.single-post').remove();
	getPosts();
})

var $homeButton = $('#logo');
$homeButton.click(function(){
	$('.posters').remove();
	$('#comment-box').remove();
	$('#commentModal').remove();
	$('.single-post').remove();
	getPosts();
});

var $logoutButton = $('#logout');
// logs user out on click
$logoutButton.click(function(){
	Cookies.remove('loggedinId');
	$('#front-page').show();
	$('#user-page').toggle();
	showSplashPage();
	location.reload();
});

$postButton.click(function(){
	createPost();
	// getPosts();
});

$commentButton.click(function(){
	createComment();
});

var createPost = function(){
	var title = $('#title-holder').val();
	// console.log(title);
	var content = $('#post-holder').val();
	console.log(content);
	var postData = {
		title: title,
		content: content
	};
	$.ajax({
		url: "http://localhost:3000/user/post",
		method: "POST",
		data: postData
	}).done();
};

var getPostsCurrentUser = function(){
	$.ajax({
		url: 'http://localhost:3000/users/posts',
		method: 'GET',
		dataType: 'json'
	}).done(populatePostsCurrentUser);
};

var populatePostsCurrentUser = function(data){
	var counter = 0;
	// console.log(data);
	for (var i = data.length-1; i >= 0; i-=4) {
		counter++;
		var date = data[i].slice(5,10);
		$("#posts-holder").append('<div id="'+ (counter - 1) +'" / class="posters">' + date + "</br>" +  "<h2>" + data[i-1] + "</h2>" + "</br>" + "<p>" + data[i-2] + "</p>" +"</br>");
		$("#" + (counter - 1)).click(function(){
			$('.posters').remove();
			$('#comment-box').remove();
			$('#commentModal').remove();
			$('.single-post').remove();
			var id = $(this).attr('id');
			var getContent = function(){
				$.ajax({
					url: 'http://localhost:3000/users/onepost',
					method: 'GET',
					dataType: 'json',
				}).done(viewContent);
			};
			var viewContent = function(data){
				var date = data[id].date;
				var userId = data[id].userId;
				var dateFixed = date.slice(5,10);
				$("#posts-holder").append('<div id="'+ id +'" / class="posters" data-userId="'+ userId +'">' + dateFixed + "</br>" + "<h2>" + data[id].title + "</h2>" + "</br>" + "<p>" + data[id].content + "</p>" + "</br>");
				$("#commentbutton-holder").append('</br>' + '<button type="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal2" id="commentModal">Create Comment');
			};
			var getComments = function(){
				$.ajax({
					url: 'http://localhost:3000/post/comments',
					method: 'GET',
					dataType: 'json'
				}).done(populateComments);
			};
			var populateComments = function(data){
				var currentPost = $('#' + id).attr('data-postId');
				// console.log(currentPost);
				// console.log(data);
				// var post = data[id];
				// var comments = post.comments;
				// console.log(comments);
				for (var i = 0; i < data.length; i++) {
					var commentMatch = data[i].postId;
					// console.log(commentMatch);
					if (currentPost === commentMatch) {
				// 	var chosenComment = comments[i];
					var content = data[i].content;
					var date = data[i].created_at;
					var userId = data[i].creator;
					var dateFixed = date.slice(5,10);
						$("#posts-holder").append('<div id="'+ id +'" / class="single-post" data-userId="'+ userId +'">' + dateFixed + "</br>" + content + "</br>");
					}else{
						console.log("nope");
					}
				};
			};
			getContent();
			getComments();
		});
	};
};

var getPosts = function(){
	$.ajax({
		url: 'http://localhost:3000/users/allposts',
		method: 'GET',
		dataType: 'json'
	}).done(populatePosts);
};

var populatePosts= function(data){
	var counter = 0;
	for (var i = data.length-1; i >= 0; i-=4) {
		counter++;
		var date = data[i].slice(5,10);
		$("#posts-holder").append('<div id="'+ (counter -1) +'" / class="posters">' + date + "</br>" +  "<h2>" + data[i-1] + "</h2>" + "</br>" + "<p>" + data[i-2] + "</p>" + "</br>");
		$("#" + (counter - 1)).click(function(){
			$('.posters').remove();
			$('#comment-box').remove();
			$('#commentModal').remove();
			$('.single-post').remove();
			var id = $(this).attr('id');
			var getContent = function(){
				$.ajax({
					url: 'http://localhost:3000/users/onepost',
					method: 'GET',
					dataType: 'json',
				}).done(viewContent);
			};
			var viewContent = function(data){
				console.log(data);
				var date = data[id].date;
				var userId = data[id].userId;
				var postId = data[id].postId;
				var dateFixed = date.slice(5,10);
				$("#posts-holder").append('<div id="'+ id +'" / class="single-post" data-userId="'+ userId +'" data-postId="' + postId +'">' + dateFixed + "</br>" + "<h2>"+data[id].title + "</h2>" + "</br>" + "<p>" + data[id].content + "</p>" + "</br>");
				$("#commentbutton-holder").append("</br>" + '<button type="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal2" id="commentModal">Create Comment');
			};
			var getComments = function(){
				$.ajax({
					url: 'http://localhost:3000/post/comments',
					method: 'GET',
					dataType: 'json'
				}).done(populateComments);
			};
			var populateComments = function(data){
				var currentPost = $('#' + id).attr('data-postId');
				// console.log(currentPost);
				// console.log(data);
				// var post = data[id];
				// var comments = post.comments;
				// console.log(comments);
				for (var i = 0; i < data.length; i++) {
					var commentMatch = data[i].postId;
					// console.log(commentMatch);
					if (currentPost === commentMatch) {
				// 	var chosenComment = comments[i];
					var content = data[i].content;
					var date = data[i].created_at;
					var userId = data[i].creator;
					var dateFixed = date.slice(5,10);
						$("#posts-holder").append('<div id="'+ id +'" / class="single-post" data-userId="'+ userId +'">' + dateFixed + "</br>" + content + "</br>");
					}else{
						console.log("nope");
					}
				};
			};
			getContent();
			getComments();
		});
	};
};

var createComment = function(){
	var content = $('#comment-holder').val();
	var postUserId = $('.single-post').attr("data-userId");
	var postPostId = $('.single-post').attr("data-postId");
	var postPosition = $('.single-post').attr("id");
	console.log(postPosition);
	console.log(content);
	var postData = {
		username: postUserId,
		username2: postPostId,
		content: content,
		postPosition: postPosition
	};
	$.ajax({
		url: "http://localhost:3000/post/comment",
		method: "POST",
		data: postData
	}).done();
};











