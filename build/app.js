'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'partials/partial1.html',
            controller: 'MyCtrl1'
        });
        $routeProvider.when('/view2', {
            templateUrl: 'partials/partial2.html',
            controller: 'MyCtrl2'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'login'
        });
        $routeProvider.otherwise({
            redirectTo: '/view1'
        });
    }]);
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cook.services', []).
  value('version', '0.1');

'use strict';

/* Controllers */

angular.module('cook.controllers', [])
    .controller('MyCtrl1', ['$scope', function ($scope) {

    }])
    .controller('MyCtrl2', ['$scope', function ($scope) {

    }]);




'use strict';

/* Filters */

angular.module('cook.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

'use strict';

/* Directives */


angular.module('cook.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

/**
 * Created by arnaud on 10/08/14.
 */
var refreshAccesstoken = function () {
    var deferred = $q.defer();

    // Refresh access-token logic

    return deferred.promise;
};


app.config(function (RestangularProvider) {
    console.log('Restangular OK');
    RestangularProvider.setBaseUrl('http://cuisine.dev/api/v1/');
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    RestangularProvider.setDefaultHeaders({"X-Auth-Token": "x-restangular"});

    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {
        if (response.status === 403) {
            refreshAccesstoken().then(function () {
                // Repeat the request and then call the handlers the usual way.
                $http(response.config).then(responseHandler, deferred.reject);
                // Be aware that no request interceptors are called this way.
            });

            return false; // error handled
        }

        return true; // error not handled
    });
})

/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', function ($scope, Restangular) {
    var articles = Restangular.all("articles").getList();
    console.log(articles);
}]);
