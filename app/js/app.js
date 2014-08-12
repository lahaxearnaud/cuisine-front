'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'angular-loading-bar',
    'ngCookies',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'main'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'login'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }])

    .value('authentification', {
        'token': '',
        'id': 0,
        'username': '',
        'logged': false
    });