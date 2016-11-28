
var user = null;

//============
// Grabbers
//============
var $closeButton = $('#close-button');

var $usernameAlert = $('.alert');
console.log($usernameAlert);

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
	// console.log(map)
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

var $logoutButton = $('#logout');
// logs user out on click
$logoutButton.click(function(){
	Cookies.remove('loggedinId');
	$('#front-page').show();
	$('#user-page').toggle();
	showSplashPage();
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
