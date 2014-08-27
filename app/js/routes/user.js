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
        $routeProvider.when('/profile', {
            templateUrl: 'partials/user/profile.html',
            controller: 'user.profile'
        });
}]);