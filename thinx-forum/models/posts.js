var mongoose = require('mongoose');
var CommentSchema = require('./comments').schema;
var UserSchema = require('./user').schema;

var PostsSchema = new mongoose.Schema({
	creator : String,
	title: String,
	content: String,
	postNumber: Number,
	comments: [CommentSchema],
	created_at: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', PostsSchema);
module.exports = Post;