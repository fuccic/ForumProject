var mongoose = require('mongoose');
var PostsSchema = require('./posts').schema;

var userSchema = new mongoose.Schema({
	password_hash: String,
	username: String,
	posts: [PostsSchema],
	created_at: { type: Date, default: Date.now},
	updated_at: { type: Date, default: Date.now}
});

//userSchema.methods.sayHello = function() {
//  console.log("Hi " + this.first_name);
//};

var User = mongoose.model('User', userSchema);
module.exports = User;