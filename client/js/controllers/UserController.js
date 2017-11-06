'use strict';

app.controller('UserController', ['$scope', '$window', '$rootScope', '$location', 'UserFactory', 'ModalDialogFactory', '$routeParams',
    function ($scope, $window, $rootScope, $location, UserFactory, ModalDialogFactory, $routeParams) {
        let userId = $routeParams.id;

        UserFactory.getUser(userId, function (data) {
            $scope.user = data;
        }, function(data){
            ModalDialogFactory.showAlertError(data);
            $rootScope.user = null;
            $location.url('/');
        });

    }
]);