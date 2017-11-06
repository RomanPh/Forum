/*jslint node: true */
'use strict';

var userController = require('./../controllers/user.js');
var express = require('express');
var router = express.Router();
var accessControl = require('./../routers/accessControl.js');

module.exports = function (passport) {

    router.post('/logout', function (req, res) {
        userController.logOutUser(req.user);
        req.logOut();
        res.sendStatus(200);
    });

    router.post('/signup', function (req, res) {
        userController.addUser(req, res);
    });

    router.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).send(info.message);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send(user);
            });
        })(req, res, next);
    });

    router.route('/users/:id')
        .get(accessControl.checkProfileAccess, function (req, res) {
            //console.log(' access to user ');
            userController.getUser(req.params.id, function (user) {
                res.json(user);
            });
        })
        .post(accessControl.checkAdminPermission, function (req, res) {
            //console.log('ban user server router ' + req.body.isBanned);
            userController.updateUser(req, res);
        });

    router.route('/users')
        .get(accessControl.checkAdminPermission, function (req, res) {
            userController.getUsers(req, res);
        });

    return router;
};