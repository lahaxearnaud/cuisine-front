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
