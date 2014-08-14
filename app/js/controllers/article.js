'use strict';

app.controller('article.list', ['$scope', 'Restangular', '$routeParams' function ($scope, Restangular, $cookieStore, $routeParams) {
	var page = 1;
	if($routeParams.page) {
		page = $routeParams.page;
	}
	console.log('Page ' + page );

	var articles = Restangular.all("articles").getList('', {'page': page}).then(function(articles) {
        $scope.articles = articles;
    });
}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', function ($scope, Restangular, $cookieStore, $routeParams) {
	console.log($routeParams);
	console.log('ID ' + $routeParams.id );

	var articles = Restangular.all("articles").get($routeParams.id).then(function(article) {
        $scope.article = article;
    });
}]);