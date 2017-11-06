/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

var topicController = require('./../controllers/topic.js');
var express = require('express');
var accessControl = require('./../routers/accessControl.js');
var router = express.Router();

router.route('/topics/:id')
    .get(function (req, res) {
        topicController.getTopicById(req, res);
    })
    .post(accessControl.checkAccess, function (req, res) {
        topicController.updateTopic(req, res);
    })
    .delete(accessControl.checkAdminPermission, function (req, res) {
        let result = {};
        topicController.deleteTopic(req.params.id, function (result) {
            res.send(result.data ? result.data : result.error);
        });

    });

router.route('/topics')
    .post(accessControl.checkAccess, function (req, res) {
        topicController.addTopic(req, res);
    });

module.exports = router;