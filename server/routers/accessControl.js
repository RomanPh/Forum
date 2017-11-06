"use strict";
var userController = require('./../controllers/user.js');

module.exports = (function () {
    return {
        checkAccess: function (req, res, next) {
            if (req.isAuthenticated()) {
                //console.log('Authenticated');
                userController.getUser(req.user._id, function (user) {
                    user.lastActivity = Date.now();
                    user.save(function (err, updatedUser) {
                        if (err) console.log('Last activity time updating error ' + err);
                    });
                    if (!user.isBanned || user.isAdmin) {
                        return next();
                    } else {
                        res.status(500).send('Your account is banned').end();
                    }
                });
            } else {
                res.status(500).send('Please login or sign up').end();
            }
        },

        checkProfileAccess: function (req, res, next) {
            if (req.isAuthenticated()) {
                userController.getUser(req.user._id, function (user) {
                    user.lastActivity = Date.now();
                    user.save(function (err, updatedUser) {
                        if (err) console.log('Last activity time updating error ' + err);
                    });
                    if ((req.params.id == user._id) || user.isAdmin) {
                        return next();
                    } else {
                        res.status(500).send('You have not permission to review profile ').end();
                    }
                });
            } else {
                res.status(500).send('Please login or sign up').end();
            }
        },
        checkModifyAccessExpired: function (user, created_at, updated_at) {
            let editingLimitationTime = 2 * 60 * 1000; // ms time
            let timeInterval = updated_at - Date.parse(created_at);
            return (user.isAdmin || (timeInterval <= editingLimitationTime)) ? true : false;
        },

        checkAdminPermission: function (req, res, next) {
            if (req.isAuthenticated()) {
                userController.getUser(req.user._id, function (user) {
                    //user.isAdmin = true;
                    if (user.isAdmin) {
                        return next();
                    } else {
                        res.status(500).send('Your have not permission').end();
                    }
                });
            } else {
                res.status(500).send('Please login or sign up').end();
            }
        }
    };

})();