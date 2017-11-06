'use strict';

app.controller('CategoryController', ['$scope', '$location', '$rootScope', '$routeParams', 'CategoryFactory', 'ModalDialogFactory',
    function ($scope, $location, $rootScope, $routeParams, CategoryFactory, ModalDialogFactory) {

        CategoryFactory.getCategories(function (data) {
            $scope.categories = data;
        });

        $scope.saveCategory = function (category) {
            CategoryFactory.updateCategory(category, function (data) {
                CategoryFactory.getCategories(function (data) {
                    $scope.categories = data;
                });
            }, function (data) {
                ModalDialogFactory.showAlertError(data);
            });
            $scope.editCategory = false;
        };

        $scope.addCategory = function (newCategory) {
            CategoryFactory.addCategory(newCategory, Date.now(), function () {
                CategoryFactory.getCategories(function (data) {
                    $scope.categories = data;
                });
                $scope.newCategory = '';
            }, function (data) {
                ModalDialogFactory.showAlertError(data);
            });
        };

        $scope.deleteCategory = function (category) {
            CategoryFactory.deleteCategory(category._id, function (data) {
                CategoryFactory.getCategories(function (data) {
                    $scope.categories = data;
                }, function (data) {
                    ModalDialogFactory.showAlertError(data);
                });
            });
        };

        $scope.popOverWindow = {
            isOpen: false,
            templateUrl: 'partials/addCategory.html',
            openAddCategory: function () {
                console.log('show pop over');
                $scope.popOverWindow.isOpen = true;
            },
            addCategory: function (newCategory) {
                console.log('add ' + newCategory);
                $scope.addCategory(newCategory);
                $scope.popOverWindow.isOpen = false;
            },
            close: function () {
                $scope.popOverWindow.isOpen = false;
            }
        };
    }
]);