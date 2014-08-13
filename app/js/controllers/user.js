/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', '$cookieStore', '$rootScope', function ($scope, Restangular, $cookieStore, $rootScope) {

    $scope.submitForm = function() {
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').post($scope.login).then(function(auth) {
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
                $cookieStore.put("authentification", auth);
                $rootScope.authentification = auth;
                $scope.authentification = auth;
                if(!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        }
    };

    $scope.$watch('loginForm', function(theForm) {
        if(theForm) {
            $scope.formDebugText = 'Form in Scope';
        }
        else {
            $scope.formDebugText = 'Form is Undefined';
        }
    });

    $scope.authentification = $rootScope.authentification;
}]);