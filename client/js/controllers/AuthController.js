'use strict';

app.controller('AuthController', ['$scope', '$window', '$rootScope', '$location', 'UserFactory', 'ModalDialogFactory', '$routeParams',
    function ($scope, $window, $rootScope, $location, UserFactory, ModalDialogFactory, $routeParams) {

        UserFactory.getUsers(function (data) {
            let newData = {};
            $scope.users = data;
        }, function(data){
            if ($location.url().indexOf('users') > -1) 
            ModalDialogFactory.showAlertError(data);
        });

        $scope.banUser = function (user) {
            UserFactory.updateUser(user, function (result) {
                UserFactory.getUsers(function (data) {
                    $scope.users = data;
                });
            });
        };

        $scope.signup = function (user) {
            UserFactory.addUser(user, function (data) {
                ModalDialogFactory.showAlertSuccess(data.message);
            }, function (data) {
                ModalDialogFactory.showAlertError(data.message);
                $scope.message = '';
            });
            $scope.user = {};
            $scope.userForm.$setPristine();
        };

        $scope.login = function (user) {
            UserFactory.logIn(user, function (data) {
                $rootScope.user = data;
                ModalDialogFactory.showAlertSuccess(`Welcome ${data.first_name}`);
                $location.url('/');
            }, function (data) {
                //ModalDialogFactory.showAlertError(data);
            });
        };
    }
]);