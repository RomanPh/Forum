'use strict';

app.factory('TopicFactory', ['$http', function ($http) {

    var factory = {};

    factory.getTopics = function (categoryId, resolve, reject) {
        console.log('topics id cat  ' + categoryId);
        $http({
            method: 'GET',
            url: `/categories/${categoryId}`
        }).then(function successCallback(response) {
            //console.log('topics data ' + response.data.name);
            resolve(response.data);
        }, function errorCallback(response) {
            reject(response);
        });
    };

    factory.getTopicById = function (id, resolve, reject) {
        $http({
            method: 'GET',
            url: `/topics/${id}`
        }).then(function successCallback(response) {
            //console.log('request topic by id ' + response.data);
            resolve(response.data);
        }, function errorCallback(response) {
            reject(response);
        });

    };

    factory.addTopic = function (newTopic, resolve, reject) {
        $http({
            method: 'POST',
            url: '/topics',
            data: {
                topic: newTopic
            }
        }).then(function successCallback(response) {
            resolve(response.data);
        }, function errorCallback(response) {
            reject(response.data);
        });
    };

    factory.addPost = function (newPost, resolve, reject) {
        $http({
            method: 'POST',
            url: '/posts',
            data: {
                post: newPost
            }
        }).then(function successCallback(response) {
            resolve(response.data);
        }, function errorCallback(response){
            reject(response.data);
        });
    };

    factory.addVote = function (post, userId, vote, resolve) {
        $http({
            method: 'POST',
            url: `/posts/${post._id}/vote`,
            data: {
                post: post,
                userId: userId,
                vote: vote
            }
        }).then(function successCallback(response) {
            resolve(response.data);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    factory.updateTopic = function (topic, resolve, reject) {
        $http.post(`/topics/${topic._id}/`, topic)
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                reject(response.data);
            });
    };

    factory.updatePost = function (post, resolve, reject) {
        $http.post(`/posts/${post._id}/`, post)
            .then(function successCallback(response) {
                console.log('success in updated post');
                resolve(response.data);
            }, function errorCallback(response) {
                console.log('error in updated post');
                reject(response.data);
            });
    };

     factory.chooseBestAnswer = function (post, resolve, reject) {
        $http.post(`/posts/${post._id}/bestAnswer`, post)
            .then(function successCallback(response) {
                console.log('success in choosing the best post');
                resolve(response.data);
            }, function errorCallback(response) {
                console.log('error in choosing the best post');
                reject(response.data);
            });
    };

    factory.deletePost = function (post, callback) {
        $http.delete(`/posts/${post._id}`)
            .then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                console.log(response);
            });
    };

    factory.deleteTopic = function (topic, resolve, reject) {
        $http({
                method: 'DELETE',
                url: `/topics/${topic._id}`
            })
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                reject(response.data);
            });
    };

    return factory;

}]);