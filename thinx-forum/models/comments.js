var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	content: String,
	user_id: String,
	created_at: { type: Date, default: Date.now}
});

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;