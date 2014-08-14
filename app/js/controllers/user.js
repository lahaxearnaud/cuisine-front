/**
 * Created by arnaud on 10/08/14.
 */
'use strict';

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
            });
        }
    };
}]);

app.controller('user.logout', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', function ($scope, Restangular, $cookieStore, $rootScope, $location) {
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