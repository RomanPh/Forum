"use strict";

app.factory('ModalDialogFactory', ['$uibModal', '$location', function ($uibModal, $location) {
    let factory = {};

    factory.showAlertSuccess = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: './partials/success.html',
            controller: 'ModalController',
            size: 'sm',
            resolve: {
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Modal window of success');
        }, function () {
            console.log('Error in success modal window');
        });
    };

    factory.showAlertError = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: './partials/error.html',
            controller: 'ModalController',
            size: 'sm',
            resolve: {
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Modal window of error');
        }, function () {
            console.log('Error in error modal window');
        });
    };

    return factory;
}]);