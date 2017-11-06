var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostScheme = new Schema({
    description: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    topic_id: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
    comment: String,
    users_like: [{type: Schema.Types.ObjectId, ref: 'User'}],
    users_dislike: [{type: Schema.Types.ObjectId, ref: 'User'}],
    best_answer: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now}
});

 module.exports = mongoose.model('Post', PostScheme);