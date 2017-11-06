'use strict';

app.controller('NavigationController', ['$scope', '$location',
    '$rootScope', 'NavigationFactory', 'ModalDialogFactory',
    function ($scope, $location, $rootScope, NavigationFactory, ModalDialogFactory) {
        $scope.logOut = function () {
            NavigationFactory.logOut(function () {
                $rootScope.user = null;
                $location.url('/');
            });
        };
    }
]);