"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserScheme = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    isOnline: { type: Boolean, default: false },
    lastActivity: { type: Date, default: Date.now },
    lastVisit: { type: Date, default: Date.now },
    isBanned: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
});

// generating a hash
UserScheme.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserScheme.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserScheme);