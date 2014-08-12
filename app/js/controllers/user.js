/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', '$cookieStore', 'authentification', function ($scope, Restangular, $cookieStore, authentification) {

    $scope.submitForm = function() {
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').post($scope.login).then(function(auth) {
                app.value('authentification', auth);
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
                $cookieStore.put("authentification", auth);
                $scope.authentification = auth;
                $scope.$apply();
            });
        }
    };

    $scope.authentification = authentification;
}]);