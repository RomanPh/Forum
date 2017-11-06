'use strict';

var app = angular.module('myApp', [
        'ui.bootstrap',
        'ngMaterial',
        'ngRoute'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/categories.html',
            controller: 'CategoryController'
        });
        $routeProvider.when('/categories/:id/topics', {
            templateUrl: 'partials/topics.html',
            controller: 'TopicListController'
        });
        $routeProvider.when('/topics/:id', {
            templateUrl: 'partials/showtopic.html',
            controller: 'TopicController'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'AuthController'
        });
        $routeProvider.when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'AuthController'
        });
        $routeProvider.when('/users', {
            templateUrl: 'partials/usersList.html',
            controller: 'AuthController'
        });
        $routeProvider.when('/users/:id', {
            templateUrl: 'partials/userProfile.html',
            controller: 'UserController'
        });

    }]);