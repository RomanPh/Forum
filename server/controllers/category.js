/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

var mongoose = require('mongoose');
//require('./../config/mongoose.js').connectToMongo();
var Category = require('./../models/category_model.js');
var Topic = require('./../models/topic_model.js');
var topicCtrl = require('./../controllers/topic.js');
var Post = require('./../models/post_model.js');

module.exports = (function() {

    return {

        addCategory: function(req, res) {
            var category = new Category({
                name: req.body.category,
                created_at: req.body.created_at
            });

            category.save(function(err) {
                if (!err) {
                    res.send(true);
                } else {
                    res.status(500).send('Category adding error').end();
                }
            });
        },

        getCategories: function(req, res) {
            Category.find({})
                .populate({
                    path: 'topics'
                })
                .exec(function (err, topics) {
                    if (err) return res.status(500).end(err);
                    res.json(topics);
                });
        },

        getCategory: function(req, res) {
            Category.find({ _id: req.params.id }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(result);
                }
            });
        },

        updateCategory: function(req, res) {
            Category.findOneAndUpdate({ _id: req.body._id },
                req.body, { upsert: true, new: true, runValidators: true },
                function(err, updatedCategory) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(updatedCategory);
                    }
                }
            );
        },

        deleteCategory: function(req, res) {
            let message = {};
            Category.findOneAndRemove({ _id: req.params.id }, function(err, category) {
                Topic.find({ category_id: category._id }).cursor()
                    .on("error", function(error) {
                        console.log("error in finding topic");
                    })
                    .on("data", function(topic) {
                        topicCtrl.deleteTopic(topic._id, function(result){
                            console.log(result.error ? result.error : result.data);
                        });
                    })
                    .on("close", function() {
                        console.log("close method deleting topics and posts");
                    });
            });
            res.send(true).end();
        }
    };
})();