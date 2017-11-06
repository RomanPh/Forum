"use strict";

var LocalStrategy = require('passport-local').Strategy;
var User = require('./../models/user_model.js');


module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        //console.log('serializeUser ' + user);
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        //console.log('DeserializeUser ' + user.email + '  ' + user.password);
        done(null, user);
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (!user) {
                    console.log('Incorrect login');
                    return done(null, false, {
                        message: 'Incorrect login'
                    });
                }
                if (!user.validPassword(password)) {
                    console.log('Incorrect password');
                    return done(null, false, {
                        message: 'Incorrect password'
                    });
                }
                user.lastVisit = Date.now();
                user.lastActivity = Date.now();                
                user.save(function (err, updatedUser) {
                    if (err) return err;
                });
                return done(null, user);
            });

        }));
};