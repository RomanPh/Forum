/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

var mongoose = require('mongoose');
//require('./../config/mongoose.js').connectToMongo();
var User = require('./../models/user_model.js');
var Topic = require('./../models/topic_model.js');
var Category = require('./../models/category_model.js');
var Post = require('./../models/post_model.js');
var accessControl = require('./../routers/accessControl.js');

module.exports = (function () {

    return {

        addTopic: function (req, res) {
            //console.log('add topic server ');
            var category_id = Category.findOne({
                _id: req.body.topic.category_id
            }, function (err, category) {
                var topic = new Topic(req.body.topic);
                topic.save(function (err) {
                    if (err) {
                        console.log('Topic saving error ' + err);
                        return err;
                    }
                });
                User.findOne({
                    _id: req.user._id
                }, function (err, user) {
                    if (err) return res.json(err);
                    user.topics.push(topic._id);
                    user.save(function (err, updatedUser) {
                        if (err) return res.status(500).send('Error inserting user topic into User document').end();
                    });
                });

                category.topics.push(topic._id);
                category.save(function (err) {
                    if (!err) {
                        res.json(200);
                    } else {
                        console.log('Topic reference saving error into category ' + err);
                    }
                });
            });
        },

        getTopics: function (req, res) {
            Topic.find({
                    category_id: req.params.id
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'user_id'
                    }
                })
                .exec(function (err, topics) {
                    if (err) return res.status(500).end(err);
                    res.json(topics);
                });
        },

        getTopicById: function (req, res) {
            Topic.find({
                    _id: req.params.id
                })
                .populate({
                    path: 'posts user_id',
                    populate: {
                        path: 'user_id'
                    }
                })
                .exec(function (err, topic) {
                    if (err) return res.status(500).end(err);
                    res.json(topic);
                });

        },

        updateTopic: function (req, res) {
            let updatingStatus = false;
            let userTopic = false;

            Topic.findOne({
                _id: req.body._id
            }, function (err, topic) {
                if (err) return console.log('Error in finding topic ' + err);
                //Check user permission for updating topic
                if ((req.user.isAdmin) || ((req.user._id == topic.user_id) && (accessControl.checkModifyAccessExpired(req.user, topic.created_at, req.body.updated_at)))) {
                    topic.description = req.body.description;
                    //Check changing topic category 
                    if (topic.category_id !== req.body.category_id) {
                        topic.category_id = req.body.category_id;
                        //Change  category topic 
                        Category.find({}, function (err, categories) {
                            if (err) console.log('Category finding error for changing topic directory ' + err);
                            categories.map(function (item) {
                                //Deleting topic index from old category
                                if (item.topics.indexOf(topic._id) > -1) {
                                    let topicIndex = item.topics.indexOf(topic._id);
                                    item.topics.splice(topicIndex, 1);
                                }
                                //Inserting topic index into new category
                                if (item._id == req.body.category_id) {
                                    item.topics.push(topic._id);
                                }
                                item.save(function (err, updateItem) {
                                    if (err) console.log('Categories saving error' + err);
                                });
                                return item;
                            });

                        });
                    }
                    updatingStatus = true;
                } else {
                    return res.status(500).send('You haven\'t permission to change topic').end();
                }
                topic.save(function (err, updatedTopic) {
                    if (err) return console.log('Error in topic update ' + err);
                    if (updatingStatus) {
                        res.send(updatedTopic);
                    } else {
                        res.status(500).send('Topic updating time has expired').end();
                    }
                });
            });
        },

        addPost: function (req, res) {
            var topic_id = Topic.findOne({
                _id: req.body.post.topic_id
            }, function (err, topic) {
                var post = new Post(req.body.post);
                User.findOne({
                    _id: req.body.post.user_id
                }, function (err, user) {
                    if (err) return res.json(err);
                    user.posts.push(post._id);
                    user.save(function (err, updateduser) {
                        if (err) return res.status(500).send('Error inserting user post into User document').end();
                    });
                });
                topic.posts.push(post._id);
                post.save(function (err) {
                    if (!err) {
                        topic.save(function (err) {
                            if (err) console.log('Did not saved change of property posts in the topic');
                        });
                        res.send(true);
                    } else {
                        console.log(err);
                    }
                });
            });
        },

        updatePost: function (req, res) {
            let updatingStatus = false;
            let userPost = false;
            // Updating post description
            Post.findById(req.body._id, function (err, post) {
                if (err) return res.json(err);
                //Check relation topic to user
                //Check user permission for updating
                if (((req.user._id == post.user_id) && (accessControl.checkModifyAccessExpired(req.user, post.created_at, req.body.updated_at))) || (req.user.isAdmin)) {
                    post.description = req.body.description;
                    updatingStatus = true;
                } else {
                    return res.status(500).send('You haven\'t permission to change post').end();
                }
                post.save(function (err, updatedPost) {
                    if (err) return console.log('Error in post updating ' + err);
                    if (updatingStatus) {
                        return res.send(updatedPost).end();
                    } else {
                        return res.status(500).send('Post updating time has expired').end();
                    }
                });
            });

        },

        chooseBestAnswer: function (req, res) {
            let bestAnsQuantity = [];
            let oldBestAnswerValue;
            let userTopic = false;

            Post.find({
                topic_id: req.body.topic_id
            }, function (err, posts) {
                if (err) return res.status(500).send(err).end();
                bestAnsQuantity = posts.filter(function (index) {
                    return index.best_answer;
                });
                //console.log('Find post by id');
                Post.findById(req.body._id, function (err, post) {
                    if (err) return res.json(err);
                    oldBestAnswerValue = post.best_answer;
                    //Check relation post to user
                    userTopic = req.user.topics.indexOf(req.body.topic_id.toString());
                    // Checking present only one best answer and user accessiing to topic with the best answer
                    if (userTopic >= 0) {
                        if (!bestAnsQuantity.length) {
                            post.best_answer = req.body.best_answer;
                            //console.log(' result best answer ' + post.best_answer);
                        }
                        //Cancel the best answer
                        if (!req.body.best_answer) {
                            post.best_answer = req.body.best_answer;
                        }
                    } else {
                        return res.status(500).send('You can\'t choose the best answer').end();
                    }

                    post.save(function (err, updatedPost) {
                        if (err) return console.log('Error in post updating ' + err);
                        if (oldBestAnswerValue !== updatedPost.best_answer) {
                            return res.send(updatedPost).end();
                        } else {
                            return res.status(500).send('The best answer alerady exist. You can dismiss it and choose again ').end();
                        }
                    });
                });
            });
        },

        deletePost: function (req, res) {
            Post.findByIdAndRemove(req.params.id, function (err, post) {
                if (err) {
                    console.log('Post deleting error ' + err);
                    return res.json(err);
                }
                Topic.findOne({
                    _id: post.topic_id
                }, function (err, topic) {
                    let postIndex = topic.posts.indexOf(post._id);
                    if (postIndex > -1) {
                        topic.posts.splice(postIndex, 1);
                        topic.save(function (err) {
                            if (err) {
                                console.log('Topic updating error on server side ' + err);
                                return res.json(err);
                            }
                        });
                    }
                    return res.json(post);
                });

            });
        },

        addLike: function (req, res) {
            let userIdWhoLIke = req.body.userId;
            Post.findById({
                _id: req.body.post._id
            }, function (err, post) {
                if (err) return res.send(err);
                //if ((post.users_like.indexOf(userIdWhoLIke) !== -1) && (post.user_id !== userIdWhoLIke) ){
                if ((post.users_like.indexOf(userIdWhoLIke) == -1)) {

                    if (post.users_dislike.indexOf(userIdWhoLIke) !== -1) {
                        let userDisLIkeIndex = post.users_dislike.indexOf(userIdWhoLIke);
                        post.users_dislike.splice(userDisLIkeIndex, 1);
                    }
                    post.users_like.push(req.body.userId);
                    post.save(function (err, updatedPost) {
                        if (err) return res.send(err);
                    });
                }
                res.json(post);
            });

        },

        addDisLike: function (req, res) {
            let userIdWhoDisLIke = req.body.userId;
            Post.findById({
                _id: req.body.post._id
            }, function (err, post) {
                if (err) return res.send(err);
                //if ((post.users_like.indexOf(userIdWhoDisLIke) !== -1) && (post.user_id !== userIdWhoDisLIke) ){
                if ((post.users_dislike.indexOf(userIdWhoDisLIke) == -1)) {
                    if (post.users_like.indexOf(userIdWhoDisLIke) !== -1) {
                        let userLIkeIndex = post.users_like.indexOf(userIdWhoDisLIke);
                        post.users_like.splice(userLIkeIndex, 1);
                    }
                    post.users_dislike.push(req.body.userId);
                    post.save(function (err, updatedPost) {
                        if (err) return res.send(err);
                    });
                }
                res.json(post);
            });


        },

        deleteTopic: function (id, callback) {
            let result = {};
            result.data = {};
            Topic.findOneAndRemove({
                _id: id
            }, function (err, topic) {
                if (err) {
                    result.error = err;
                    callback(result);
                    return;
                }
                console.log('find topic ' + topic._id);
                Post.find({
                    topic_id: topic._id
                }).remove().exec(function (err, post) {
                    if (err) {
                        console.log('error in deleting post ');
                        result.error = err;
                        callback(result);
                    }

                    result.data.post = post;
                });
                result.data.topic = topic;
                console.log('delete topic ' + result.data.topic);

                callback(result);
            });
        }
    };
})();