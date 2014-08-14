app.controller('article.list', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $routeParams, $log) {
	$log = $log.getInstance('article.list');

	var page = 1;
	if($routeParams.page) {
		page = $routeParams.page;
	}

	$log.debug('Page ' + page );

	Restangular.all("articles").getList({'page': page}).then(function(articles) {
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
        Restangular.all("articles").getList({'page': $scope.currentPage}).then(function(articles) {
			$scope.articles = articles;
		});
    };

}]);

app.controller('article.get', ['$scope', 'Restangular', '$routeParams', '$log', function ($scope, Restangular, $routeParams, $log) {
	$log = $log.getInstance('article.get');

	$log.debug('Get article #' + $routeParams.id );

	Restangular.one("articles", $routeParams.id).get().then(function(article) {
		$log.debug(article);
		$scope.article = article;
	});
}]);