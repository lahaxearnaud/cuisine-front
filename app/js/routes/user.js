app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'app/partials/login.html',
            controller: 'user.login',
            publicAccess: true
        });

        $routeProvider.when('/lost/password', {
            templateUrl: 'app/partials/user/lostPassword.html',
            controller: 'user.lostPassword',
            publicAccess: true
        });

        $routeProvider.when('/logout', {
            templateUrl: 'app/partials/home.html',
            controller: 'user.logout'
        });

        $routeProvider.when('/user/profile', {
            templateUrl: 'app/partials/user/profile.html',
            controller: 'user.profile'
        });

        $routeProvider.when('/user/edit', {
            templateUrl: 'app/partials/user/edit.html',
            controller: 'user.edit'
        });

        $routeProvider.when('/subscribe', {
            templateUrl: 'app/partials/subscribe.html',
            controller: 'user.subscribe',
            publicAccess: true
        });
}]);