'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'angular-loading-bar',
    'ngCookies',
    'ui.gravatar',
    'angular-blocks',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
])
    .config(['$routeProvider',
        function($routeProvider, $locationProvider) {

            $routeProvider.when('/app', {
                templateUrl: 'partials/home.html',
                controller: 'main'
            });
            $routeProvider.when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'user.login',
                publicAccess: true
            });
            $routeProvider.when('/logout', {
                templateUrl: 'partials/home.html',
                controller: 'user.logout'
            });

            $routeProvider.when('/recipes/:id', {
                templateUrl: 'partials/article/get.html',
                controller: 'article.get'
            });

            $routeProvider.when('/recipes', {
                templateUrl: 'partials/article/liste.html',
                controller: 'article.list'
            });

            $routeProvider.otherwise({
                redirectTo: '/app'
            });
    }]);

app.run(['Restangular', '$cookieStore', '$rootScope', '$route', '$location',
    function(Restangular, $cookieStore, $rootScope, $route, $location) {
        // Reload authentification from cookie
        var authentification = $cookieStore.get("authentification");
        if (authentification !== undefined) {
            Restangular.setDefaultHeaders({
                "X-Auth-Token": authentification.token
            });
            $rootScope.authentification = authentification;
        } else {
            $rootScope.authentification = {
                'token': '',
                'id': 0,
                'username': '',
                'logged': false
            };

            var routesOpenToPublic = [];
            angular.forEach($route.routes, function(route, path) {
                // push route onto routesOpenToPublic if it has a truthy publicAccess value
                route.publicAccess && (routesOpenToPublic.push(path));
            });

            var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));

            if (closedToPublic) {
                $location.path('/login');
            }

            $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {
                var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));

                if (closedToPublic) {
                    $location.path('/login');
                }
            });
        }

        $rootScope.$apply();
}]);

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cook.services', []).
  value('version', '0.1');

'use strict';

app.controller('article.list', ['$scope', 'Restangular', function ($scope, Restangular, $cookieStore) {
	var articles = Restangular.all("articles").getList().then(function(articles) {
        $scope.articles = articles;
    });
}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', function ($scope, Restangular, $cookieStore, $routeParams) {
	console.log($routeParams);
	var articles = Restangular.all("articles").get($routeParams.id).then(function(article) {
        $scope.article = article;
    });
}]);
'use strict';

/* Controllers */

angular.module('cook.controllers', [])
	.controller('main', ['$scope', function ($scope) {

}]);

/**
 * Created by arnaud on 10/08/14.
 */
'use strict';

app.controller('user.login', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', function ($scope, Restangular, $cookieStore, $rootScope, $location) {

    // if we are already logged we can go home
    if($rootScope.authentification.logged) {
        $location.path('/home');
    }

    $scope.submitForm = function() {
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').post($scope.login).then(function(auth) {
                // set header to the rest client
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
                // set auth in a cookie
                $cookieStore.put("authentification", auth);
                // set auth in global scope
                $rootScope.authentification = auth;
                // this avoid digest error (@todo dig why this error happen...)
                if(!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                // go home
                $location.path('/app');
            });
        }
    };
}]);

app.controller('user.logout', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', function ($scope, Restangular, $cookieStore, $rootScope, $location) {
    // set header to the rest client
    Restangular.setDefaultHeaders({"X-Auth-Token": ''});
    // set auth in a cookie
    $cookieStore.remove("authentification");
    // set auth in global scope
    $rootScope.authentification.logged = false;
    $rootScope.authentification.token = '';
    $rootScope.authentification.username = '';
    $rootScope.authentification.id = 0;

    if(!$rootScope.$$phase) {
        $rootScope.$apply();
    }

    $location.path('/login');
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