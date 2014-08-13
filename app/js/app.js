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
