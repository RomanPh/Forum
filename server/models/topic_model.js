
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicScheme = new Schema({
    name: String,
    description: String,
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    category_id: {type: Schema.Types.ObjectId, ref: 'Category'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

 module.exports = mongoose.model('Topic', TopicScheme);