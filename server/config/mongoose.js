/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = {
    connectToMongo : function(){
        mongoose.connect('mongodb://localhost:27017/forum', { useMongoClient: true })
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error(err));
    },

    closeMongoConnection : function() {
        mongoose.connection.close();
    }
};

