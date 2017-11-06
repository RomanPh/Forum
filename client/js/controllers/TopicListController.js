'use strict';

app.controller('TopicListController', ['$scope', '$rootScope', '$routeParams', 'TopicFactory', 'ModalDialogFactory', function ($scope, $rootScope, $routeParams, TopicFactory, ModalDialogFactory) {

    var categoryId = $routeParams.id;

    TopicFactory.getTopics(categoryId, function (data) {
        $scope.topics = data;
    });

    $scope.addTopic = function newTopic(newTopic) {
        if (!$rootScope.user) return ModalDialogFactory.showAlertError('Please log in or sign up for commenting');
        newTopic.category_id = categoryId;
        newTopic.created_at = Date.now();
        newTopic.user_id = $rootScope.user._id;
        TopicFactory.addTopic(newTopic, function () {
            TopicFactory.getTopics(categoryId, function (data) {
                $scope.topics = data;
            });
        }, function(data){
            ModalDialogFactory.showAlertError(data);
        });
        $scope.newTopic = {};
        angular.element(document.querySelector('#addTopicDialog')).modal('hide');
    };

    $scope.deleteTopic = function (topic) {
        TopicFactory.deleteTopic(topic, function (data) {
            TopicFactory.getTopics(categoryId, function (data) {
                $scope.topics = data;
            });
        });
    };

    $scope.popOverWindow = {
            isOpen: false,
            templateUrl: 'partials/addTopic.html',
            openAddTopic: function() {
                //console.log('show pop over');
                $scope.popOverWindow.isOpen = true;
            },
            addTopic: function (newTopic) {
                //console.log('add new topic ' + newTopic );
                $scope.addCategory(newCategory);
                $scope.popOverWindow.isOpen = false;
            },
            close: function() {
                $scope.popOverWindow.isOpen = false;
            }
        };
}]);