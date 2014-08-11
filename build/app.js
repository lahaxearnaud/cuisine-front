'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
])
    .config(['$routeProvider', function ($routeProvider) {
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
    }])

    .value('authentification', {
        'token': '',
        'id': 0,
        'username': ''
    });
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
app.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl('http://cuisine.dev/api/v1/');
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {

        return true; // error not handled
    });

        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var extractedData;

        if (operation === 'post' && what === 'auth') {
            extractedData = {
                'token': data.token,
                'username': data.user.username,
                'id': data.user.id,
                'email': data.user.email,
                'logged': true
            };
        } else if (operation === "getList") {
            extractedData = data.data;
            extractedData.meta = {
                'perPage': data.per_page,
                'total': data.total,
                'currentPage': data.current_page,
                'from': data.from,
                'to': data.to
            };
        } else {
            extractedData = data.data;
        }
        return extractedData;
    });
}]);

/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', function ($scope, Restangular) {
    /** var articles = Restangular.all("articles").getList().then(function(articles) {
        $scope.articles = articles;
    }); **/
    $scope.submitForm = function() {
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').post($scope.login).then(function(auth) {
                app.value('authentification', auth);
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
            });
        }
    };
}]);