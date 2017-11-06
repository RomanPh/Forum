'use strict';

app.controller('TopicController', ['$scope', '$window', '$rootScope', 'TopicFactory', '$location',
    '$routeParams', 'ModalDialogFactory', 'CategoryFactory',
    function ($scope, $window, $rootScope, TopicFactory, $location, $routeParams, ModalDialogFactory, CategoryFactory) {

        let topicId = $routeParams.id;
        $scope.newPost = {};
        $scope.newPost.description = "";

        TopicFactory.getTopicById(topicId, function (data) {
            $scope.topic = data[0];
        });

        $scope.addPost = function (topic) {
            if ($rootScope.user) {
                $scope.newPost.topic_id = topic._id;
                $scope.newPost.created_at = Date.now();
                $scope.newPost.user_id = $rootScope.user._id;
                $scope.extractPostComment($scope.newPost);
                TopicFactory.addPost($scope.newPost, function (data) {
                    TopicFactory.getTopicById(topicId, function (data) {
                        $scope.topic = data[0];
                    })
                }, function (data){
                        ModalDialogFactory.showAlertError(data);
                    
                });
                $scope.newPost = {};
            } else {
                ModalDialogFactory.showAlertError('Please log in or sign up for commenting');
            }
        };

        $scope.extractPostComment = function (newPost) {
            const startTarget = '<quote>';
            const endTarget = '</quote>';
            let startComment = newPost.description.indexOf(startTarget);
            let endComment = newPost.description.indexOf(endTarget);
            if (startComment && endComment) return;
            newPost.comment = newPost.description.substring(startComment + startTarget.length, endComment);
            newPost.description = newPost.description.substring(endComment + endTarget.length + 1);
        };

        $scope.addLike = function (post, user) {
            let vote = "like";
            if (user) {
                TopicFactory.addVote(post, user._id, vote, function (data) {
                    post.users_like.length = data.users_like.length;
                    post.users_dislike.length = data.users_dislike.length;
                });
            } else {
                ModalDialogFactory.showAlertError('Please log in or sign up for vote');
            }
        };

        $scope.addDislike = function (post, user) {
            let vote = "dislike";
            if (user) {
                TopicFactory.addVote(post, user._id, vote, function (data) {
                    post.users_like.length = data.users_like.length;
                    post.users_dislike.length = data.users_dislike.length;
                });
            } else {
                ModalDialogFactory.showAlertError('Please log in or sign up for vote');
            }
        };

        $scope.editTopic = function () {
            $scope.topicMenu = true;
            CategoryFactory.getCategories(function (data) {
                $scope.categories = data;
            });
        };

        $scope.deleteTopic = function (topic) {
            //console.log('deleting topic ' + topic._id);
            TopicFactory.deleteTopic(topic, function (data) {
                if (data) {
                    $location.path(`/categories/${data.topic.category_id}`, true);
                } else {
                    console.log('Error in topic deleting ' + data.err);
                }
            }, function(data){
                 ModalDialogFactory.showAlertError(data);
            });
        };

        $scope.saveTopic = function (topic, topicTextArea) {
            let tempTopic = {};
            Object.assign(tempTopic, topic);
            if ($scope.selectedCategory) {
                tempTopic.category_id = $scope.selectedCategory;
            }
            tempTopic.description = topicTextArea || topic.description;
            tempTopic.updated_at = Date.now();
            TopicFactory.updateTopic(tempTopic, function (data) {
                TopicFactory.getTopicById(tempTopic._id, function (data) {
                    $scope.topic = data[0];
                });
            }, function (data) {
                ModalDialogFactory.showAlertError(data);
            });
            $scope.editCategory = false;
        };

        $scope.savePost = function (post, postTextArea) {
            let tempPost = {};
            Object.assign(tempPost, post);
            tempPost.description = postTextArea.toString();
            tempPost.updated_at = Date.now();
            TopicFactory.updatePost(tempPost, function (data) {
                post.description = data.description;
            }, function (data) {
                ModalDialogFactory.showAlertError(data);
            });
        };

        $scope.deletePost = function (post, topic) {
            TopicFactory.deletePost(post, function (data) {
                TopicFactory.getTopicById(topic._id, function (data) {
                    $scope.topic = data[0];
                });
            });
        };

        $scope.chooseBestAnswer = function (post, topic) {
            let tempPost = {};
            Object.assign(tempPost, post);
            tempPost.best_answer = !post.best_answer;
            TopicFactory.chooseBestAnswer(tempPost, function (data) {
                TopicFactory.getTopicById(topic._id, function (data) {
                    $scope.topic = data[0];
                });
            }, function (data) {
                ModalDialogFactory.showAlertError(data);
            });
        };

        $scope.commentPost = function (post, newPost) {
            let commentTextArea = document.getElementById('commentTextArea');
            $scope.newPost.description = "";
            $window.scrollTo(0, commentTextArea.offsetTop);
            $scope.newPost.description = '<quote>' + post.description + '</quote>\n';
            commentTextArea.focus();
        };
    }
]);