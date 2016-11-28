var mongoose = require('mongoose');
var CommentSchema = require('./comments').schema;
var UserSchema = require('./user').schema;

var PostsSchema = new mongoose.Schema({
	_creator : { type: Number, ref: 'User' },
	title: String,
	content: String,
	comments: [CommentSchema],
	created_at: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', PostsSchema);
module.exports = Post;