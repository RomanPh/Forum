/*jslint node: true */
'use strict';

(function(){
var categoriesController = require('./../controllers/category.js');
var topicController = require('./../controllers/topic.js');
var accessControl = require('./../routers/accessControl.js');
var express = require('express');
var router = express.Router();

router.route('/categories')
    .get(function (req, res) {
        categoriesController.getCategories(req, res);
    })
    .post(accessControl.checkAdminPermission, function (req, res) {
        categoriesController.addCategory(req, res);
    })
    .put(accessControl.checkAdminPermission, function (req, res) {
        categoriesController.updateCategory(req, res);
    });

router.route('/categories/:id')
    .get(function (req, res) {
        topicController.getTopics(req, res);
    })
    .delete(accessControl.checkAdminPermission, function (req, res) {
        categoriesController.deleteCategory(req, res);
    });

module.exports = router;
})();