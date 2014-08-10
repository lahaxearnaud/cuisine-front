/**
 * Created by arnaud on 10/08/14.
 */
app.controller('login', ['$scope', 'Restangular', function ($scope, Restangular) {
    var articles = Restangular.all("articles").getList();
    console.log(articles);
}]);
