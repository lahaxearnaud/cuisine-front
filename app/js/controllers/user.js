app.controller('user.login', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log', 'loader',
    function ($scope, Restangular, $cookieStore, $rootScope, $location, $log, loader) {

        $log = $log.getInstance('user.login');

        // if we are already logged we can go home
        if ($rootScope.authentification.logged) {
            $location.path('/home');
        }

        $scope.submitForm = function () {
            $log.debug('Auth form submitted');
            if ($scope.loginForm.$valid) {
                Restangular.all('auth').login($scope.login).then(function (auth) {
                    // set header to the rest client
                    Restangular.setDefaultHeaders({
                        "X-Auth-Token": auth.token
                    });
                    // set auth in a cookie
                    $cookieStore.put("authentification", auth);
                    // set auth in global scope
                    $rootScope.authentification = auth;

                    $log.info('Connection succeeded with user ' + auth.username);

                    loader.execute();

                    // this avoid digest error (@todo dig why this error happen...)
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    // go home
                    $location.path('/app');
                }, function (auth) {
                    $log.warn('Connection failed for user ' + $scope.login.username);
                    window.location.reload();
                });
            }
        };
    }
]);

app.controller('user.logout', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log',
    function ($scope, Restangular, $cookieStore, $rootScope, $location, $log) {
        Restangular.all('auth').logout();
        // set header to the rest client
        Restangular.setDefaultHeaders({
            "X-Auth-Token": ''
        });

        // set auth in a cookie
        $cookieStore.remove("authentification");
        // set auth in global scope
        $rootScope
            .authentification.logged = false;
        $rootScope.authentification.token = '';
        $rootScope.authentification.username = '';
        $rootScope.authentification.id = 0;

        $log.info('Logout succeeded');

        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }

        $location.path('/login');
    }
]);

app.controller('user.current', ['$scope',
    function ($scope) {}
]);


app.controller('user.profile', ['$scope',
    function ($scope) {}
]);

app.controller('user.edit', ['$scope', 'Restangular', '$log',
    function ($scope, Restangular, $log) {
        $log = $log.getInstance('user.edit');
        $scope.alert = {
            'type' : '',
            'message' :''
        };

        $scope.errors = {};

        $scope.submitForm = function() {
            $log.debug($scope.user);
            Restangular.all('users').changePassword($scope.user).then(function (result) {
                $log.debug(result);
                if(result.success === true) {
                    $scope.alert.type = 'success';
                    $scope.alert.message = 'Password changed';
                }
            }, function(result) {
                $log.debug(result);

                if(result.data.newPassword) {
                    $scope.errors.newPassword = result.data.newPassword;
                }
                if(result.data.oldPassword) {
                    $scope.errors.oldPassword = result.data.oldPassword;
                }
            });
        }
    }
]);

app.controller('user.subscribe', ['$scope', 'Restangular', '$log',
    function ($scope, Restangular, $log) {
        $log = $log.getInstance('user.subscribe');

        $scope.errors = {};

        $scope.alert = {
            'type' : '',
            'message' :''
        };

        $scope.submitForm = function() {
            $log.debug($scope.user);
            Restangular.all('users').subscribe($scope.user).then(function (result) {
                $log.debug(result);
                if(result.success === true) {
                    $scope.alert.type = 'success';
                    $scope.alert.message = 'Account created';
                }
            }, function(result) {
                $log.debug(result);
                if(result.data.password) {
                    $scope.errors.password = result.data.password;
                }
                if(result.data.email) {
                    $scope.errors.email = result.data.email;
                }
                if(result.data.username) {
                    $scope.errors.username = result.data.username;
                }
            });
        };
    }
]);


