app.controller('article.list', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $cookieStore, $routeParams, $log) {
	$log = $log.getInstance('article.list');

	var page = 1;
	if($routeParams.page) {
		page = $routeParams.page;
	}

	$log.debug('Page ' + page );

	Restangular.all("articles").getList('', {'page': page}).then(function(articles) {
        $scope.articles = articles;
            $scope.totalItems = articles.meta.total;
		    $scope.currentPage = page;
		    $scope.itemsPerPage = articles.meta.perPage;
    });

    $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
    };

    $scope.pageChanged = function() {
        $log.debug('Page changed to: ' + $scope.currentPage);
        Restangular.all("articles").getList('', {'page': $scope.currentPage}).then(function(articles) {
			$scope.articles = articles;
		});
    };

}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $cookieStore, $routeParams, $log) {
	$log.log($routeParams);
	$log.debug('Get article #' + $routeParams.id );

	var articles = Restangular.all("articles").get($routeParams.id).then(function(article) {
        $scope.article = article;
    });
}]);