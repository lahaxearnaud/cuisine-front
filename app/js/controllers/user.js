/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', function ($scope, Restangular) {
    /** var articles = Restangular.all("articles").getList().then(function(articles) {
        $scope.articles = articles;
    }); **/
    $scope.submitForm = function() {
        if ($scope.loginForm.$valid) {
            Restangular.all('auth').post($scope.login).then(function(auth) {
                app.value('authentification', auth);
                Restangular.setDefaultHeaders({"X-Auth-Token": auth.token});
            });
        }
    };
}]);