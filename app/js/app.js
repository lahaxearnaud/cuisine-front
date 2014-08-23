'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'angular-loading-bar',
    'ngCookies',
    'ui.gravatar',
    'ui.bootstrap',
    'socialLinks',
    'ui.bootstrap.tpls',
    'angular-blocks',
    'picardy.fontawesome',
    'log.ex.uo',
    'btford.markdown',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
]);

app.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({
            redirectTo: '/recipes'
        });
}]);
