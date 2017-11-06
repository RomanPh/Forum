'use strict';

app.factory('CategoryFactory', ['$http', '$location', function ($http, $location) {

    var factory = {};

    factory.getCategories = function (callback) {
        $http({
            method: 'GET',
            url: '/categories'
        }).then(function successCallback(response) {
            callback(response.data);
        }, function errorCallback(response) {

        });
    };

    factory.getCategory = function (categoryId, resolve) {
        $http.get('/category/${categoryId}')
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                console.log(response);
            });
    };


    factory.updateCategory = function (category, resolve, reject) {
        $http.put('/categories/', category)
            .then(function successCallback(response) {
                resolve(response.data);
            }, function errorCallback(response) {
                reject(response.data);
            });
    };

    factory.deleteCategory = function (categoryId, callback) {
        $http.delete(`/categories/${categoryId}`)
            .then(function successCallback(response) {
                //console.log('success category deleting');
                callback(response.data);
            }, function errorCallback(response) {
                console.log('Error in category deleting ' + response);
            });
    };

    factory.addCategory = function (newCategory, created_at, resolve, reject) {
        $http({
            method: 'POST',
            url: '/categories',
            data: {
                category: newCategory,
                created_at: created_at
            }
        }).then(function successCallback(response) {
            resolve(response.data);
        }, function errorCallback(response) {
            reject(response.data);
        });

    };
    return factory;

}]);