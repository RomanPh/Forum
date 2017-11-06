'use strict';

app.factory('UserFactory', ['$http', '$window', function ($http, $window) {
    var factory = {};

    factory.getUsers = function (resolve, reject) {
        $http.get('/users')
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                console.log('users getting error ' + response.data);
                reject(response.data);
            });
    };

    factory.getUser = function (userId, resolve, reject) {
        $http.get(`/users/${userId}`)
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                //console.log('user getting error ' + response.data);
                reject(response.data);
            });
    };

    factory.updateUser = function (user, callback) {
        $http.post(`/users/${user._id}`, user)
            .then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                console.log('User updating error(client side) ' + response.data);
            });
    };

    factory.addUser = function (user, resolve, reject) {
        $http({
            method: 'POST',
            url: '/signup',
            data: {
                user: user
            }
        }).then(function successCallback(response) {
            resolve(response.data);
        }, function errorCallback(response) {
            reject(response.data);
        });
    };

    factory.logIn = function (user, resolve, reject) {
        console.log('User Factory send request');
        $http.post('/login', user)
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                reject(response.data);
            });
    };

    return factory;

}]);