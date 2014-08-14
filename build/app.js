'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'angular-loading-bar',
    'ngCookies',
    'ui.gravatar',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'picardy.fontawesome',
    'log.ex.uo',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
]);

app.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/app', {
            templateUrl: 'partials/home.html',
            controller: 'main'
        });

        $routeProvider.otherwise({
            redirectTo: '/app'
        });
}]);


app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/recipes/:id', {
            templateUrl: 'partials/article/get.html',
            controller: 'article.get'
        });

        $routeProvider.when('/recipes', {
            templateUrl: 'partials/article/liste.html',
            controller: 'article.list'
        });
}]);
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'user.login',
            publicAccess: true
        });
        $routeProvider.when('/logout', {
            templateUrl: 'partials/home.html',
            controller: 'user.logout'
        });
}]);
app.run(['Restangular', '$cookieStore', '$rootScope', '$route', '$location', '$log',
    function(Restangular, $cookieStore, $rootScope, $route, $location, $log) {
        $log = $log.getInstance('authentification');

        // Reload authentification from cookie
        var authentification = $cookieStore.get("authentification");
        if (authentification !== undefined) {
            Restangular.setDefaultHeaders({
                "X-Auth-Token": authentification.token
            });
            $rootScope.authentification = authentification;
            $log.debug('Connected as ' + authentification.username);
        }else{
            $log.debug('Guest user');
            $rootScope.authentification = {
                'token': '',
                'id': 0,
                'username': '',
                'logged': false
            };
        }

        $rootScope.$apply();
}]);

app.run(['$rootScope', '$route', '$location', '$log',
    function($rootScope, $route, $location, $log) {
        $log = $log.getInstance('firewall');

        var routesOpenToPublic = [];
        angular.forEach($route.routes, function(route, path) {
            route.publicAccess && (routesOpenToPublic.push(path));
        });

        isAllowOrRedirect($log, $location, routesOpenToPublic, $location.path(), $rootScope.authentification.logged)

        $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {
            isAllowOrRedirect($log, $location, routesOpenToPublic, $location.path(), $rootScope.authentification.logged)
        });


        $rootScope.$apply();
}]);


function isAllowOrRedirect($log, $location, publicRoutes, current, isLogged) {
    var closedToPublic = (-1 === publicRoutes.indexOf(current));

    if (closedToPublic && !isLogged) {
        $log.debug('Try to access ' + current + ' when no connected');
        $location.path('/login');
    }
}
app.config(['logExProvider', function(logExProvider) {
    logExProvider.enableLogging(true);
}]);

app.config(['logExProvider', function(logExProvider) {
    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get('$filter');
        var separator = " >> ";
        var format = "hh:mm:ss";
        var now = $filter('date')(new Date(), format);

        return "" + now + (!angular.isString(className) ? "" : " :: " + className) + separator;
    });
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
            extractedData = data;
        }

        return extractedData;
    });

    /**
     * ===============================================
     * User specific WS
     * ===============================================
     */

    RestangularProvider.addElementTransformer('auth', false, function(auth) {
            auth.addRestangularMethod('logout', 'delete', '');

            return auth;
    });

    RestangularProvider.addElementTransformer('auth', true, function(auth) {
            auth.addRestangularMethod('login', 'post', '');

            return auth;
    });

}]);


angular.module('cook.services', []).
  value('version', '0.1');

app.controller('article.list', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $routeParams, $log) {
	$log = $log.getInstance('article.list');

	var page = 1;
	if($routeParams.page) {
		page = $routeParams.page;
	}

	$log.debug('Page ' + page );

	Restangular.all("articles").getList({'page': page}).then(function(articles) {
        $scope.articles = articles;
            $scope.totalItems = articles.meta.total;
		    $scope.currentPage = page;
		    $scope.itemsPerPage = articles.meta.perPage;
    });

    $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
    };

    $scope.pageChanged = function() {
        $log.debug('Page changed to: ' + $scope.currentPage);
        Restangular.all("articles").getList({'page': $scope.currentPage}).then(function(articles) {
			$scope.articles = articles;
		});
    };

}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $routeParams, $log) {
	$log = $log.getInstance('article.get');

	$log.debug('Get article #' + $routeParams.id );

	Restangular.one("articles", $routeParams.id).get().then(function(article) {
		$log.debug(article);
		$scope.article = article;
	});
}]);
angular.module('cook.controllers', [])
	.controller('main', ['$scope', '$log', function ($scope, $log) {
		$log.log('Bite');
}]);

app.controller('user.login', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log', function ($scope, Restangular, $cookieStore, $rootScope, $location, $log) {

    $log = $log.getInstance('user.login');

    // if we are already logged we can go home
    if($rootScope.authentification.logged) {
        $location.path('/home');
    }

    $scope.submitForm = function() {
        $log.debug('Auth form submitted');
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').login($scope.login).then(function(auth) {
                // set header to the rest client
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
                // set auth in a cookie
                $cookieStore.put("authentification", auth);
                // set auth in global scope
                $rootScope.authentification = auth;

                $log.info('Connection succeeded with user '+ auth.username);

                // this avoid digest error (@todo dig why this error happen...)
                if(!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                // go home
                $location.path('/app');
            }, function (auth) {
                $log.warn('Connection failed for user ' + $scope.login.username);
            });
        }
    };
}]);

app.controller('user.logout', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log', function ($scope, Restangular, $cookieStore, $rootScope, $location, $log) {
    Restangular.all('auth').logout();
    // set header to the rest client
    Restangular.setDefaultHeaders({"X-Auth-Token": ''});
    // set auth in a cookie
    $cookieStore.remove("authentification");
    // set auth in global scope
    $rootScope.authentification.logged = false;
    $rootScope.authentification.token = '';
    $rootScope.authentification.username = '';
    $rootScope.authentification.id = 0;

    $log.info('Logout succeeded');

    if(!$rootScope.$$phase) {
        $rootScope.$apply();
    }

    $location.path('/login');
}]);
/* Filters */

angular.module('cook.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

angular.module('cook.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
}]);
