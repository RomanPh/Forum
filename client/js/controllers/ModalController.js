'use strict';

app.controller('ModalController', ['$scope', '$timeout', '$uibModalInstance', 'message', function ($scope, $timeout, $uibModalInstance, message) {
    $scope.message = message;
    //Close message after 1500 ms
    $timeout(function () {
        $uibModalInstance.close();
    }, 1500);

    $scope.close = function () {
        $uibModalInstance.close();
    };
}]);