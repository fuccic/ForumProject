var mongoose = require('mongoose');
var UserSchema = require('./user').schema;
var PostsSchema = require('./posts').schema;


var CommentSchema = new mongoose.Schema({
	content: String,
	creator: String,
	postId: String,
	relatedComments: [],
	created_at: { type: Date, default: Date.now}
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;