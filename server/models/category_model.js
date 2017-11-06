var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoryScheme = new Schema({
    name: String,
    topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
});

module.exports = mongoose.model('Category', CategoryScheme);