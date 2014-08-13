'use strict';

app.controller('article.list', ['$scope', 'Restangular', function ($scope, Restangular, $cookieStore) {
	var articles = Restangular.all("articles").getList().then(function(articles) {
        $scope.articles = articles;
    });
}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', function ($scope, Restangular, $cookieStore, $routeParams) {
	console.log($routeParams);
	var articles = Restangular.all("articles").get($routeParams.id).then(function(article) {
        $scope.article = article;
    });
}]);