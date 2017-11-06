'use strict';

app.factory('NavigationFactory', ['$http', function ($http) {
    var factory = {};
    factory.logOut = function (callback) {
        $http.post('/logout')
            .then(function () {
                callback();
            });
    };

    return factory;
}]);