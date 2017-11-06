var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentScheme = new Schema({
    comment: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    post_id: {type: Schema.Types.ObjectId, ref: 'Post'},
    created_at: {type: Date, default: Date.now}
});

 module.exports = mongoose.model('Comment', CommentScheme);