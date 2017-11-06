"use strict";

var topicController = require('./../controllers/topic.js');
var express = require('express');
var router = express.Router();
var accessControl = require('./../routers/accessControl.js');

router.route('/posts/:id')
    .post(accessControl.checkAccess, function (req, res) {
        topicController.updatePost(req, res);
    })
    .delete(accessControl.checkAdminPermission, function (req, res) {
        topicController.deletePost(req, res);
    });

router.route('/posts')
    .post(accessControl.checkAccess, function (req, res) {
        topicController.addPost(req, res);
    })
    .put(function (req, res) {
        //in developing
    });

router.route('/posts/:id/vote')
    .post(accessControl.checkAccess, function (req, res) {
        if (req.body.vote === 'like') {
            topicController.addLike(req, res);
        } else {
            topicController.addDisLike(req, res);
        }
    });

router.route('/posts/:id/bestAnswer')
    .post(accessControl.checkAccess, function (req, res) {
        topicController.chooseBestAnswer(req, res);
    });


module.exports = router;