var mongoose = require('mongoose');
var CommentSchema = require('./comments').schema;

var PostsSchema = new mongoose.Schema({
	content: String,
	comments: [CommentSchema],
	created_at: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', PostsSchema);
module.exports = Post;