"use strict";

var mongoose = require('mongoose');
//require('./../config/mongoose.js').connectToMongo();
var User = require('./../models/user_model.js');


module.exports = (function () {
    return {

        getUsers: function (req, res) {
            User.find({}, function (err, users) {
                if (err) return res.status(500).send(err).end();
                users.filter(function (item) {
                    let tempData = new Date(item.lastActivity);
                    const sessionTime = 5 * 60 * 1000;//ms
                    item.isOnline = ((Date.now() - tempData.getTime()) > sessionTime) ? false : true;
                    return true;
                });
                res.send(users).end();
            });
        },

        getUser: function (user_id, callback) {
            User.findById(user_id, function (err, user) {
                if (err) return console.log('User getting error ' + err);
                user.serverTime = Date.now();
                callback(user);
            });
        },

        updateUser: function (req, res) {
            User.findById(req.params.id, function (err, user) {
                if (err) return res.status(500).send(user).end();
                user.isBanned = req.body.isBanned;
                user.save(function (err, updatedUser) {
                    if (err) return req.status(500).send(err).end();
                    res.json(updatedUser);
                });
            });
        },

        logOutUser: function (user) {
            if (!user) return false;
            User.findById(user._id, function (err, user) {
                if (err) return console.log('Error user finding in log out ' + err);
                user.lastActivity = new Date(0);
                user.save(function (err, updatedUser) {
                    if (err) return console.log('Error user status changing in log out ' + err);
                });
            });
        },

        addUser: function (req, res) {
            User.findOne({
                email: req.body.user.email
            }, function (err, user) {
                if (user) {
                    res.status(400).send({
                        message: 'This user already exist'
                    });
                    return;
                } else {
                    var newUser = new User();
                    newUser.first_name = req.body.user.first_name;
                    newUser.last_name = req.body.user.last_name;
                    newUser.email = req.body.user.email;
                    newUser.password = newUser.generateHash(req.body.user.password);
                    newUser.save(function (err, user) {
                        if (user) {
                            res.status(200).send({
                                message: 'You are success registered'
                            });
                        }
                    });
                }
            });
        }
    };
})();