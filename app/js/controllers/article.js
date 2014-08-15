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
		$scope.article = article;
	});
}]);

app.controller('article.delete', ['$scope', 'Restangular', '$routeParams', '$log', '$location', function ($scope, Restangular, $routeParams, $log, $location) {
	$log = $log.getInstance('article.delete');

	$log.debug('Delete article #' + $routeParams.id );

	Restangular.one("articles", $routeParams.id).get().then(function(article) {
		$scope.article = article;
	});

	$scope.submitForm = function() {
		$scope.article.remove();
		$location.path('recipes');
	};
}]);

app.controller('article.edit', ['$scope', 'Restangular', '$routeParams', '$log', '$location', function ($scope, Restangular, $routeParams, $log, $location) {
	$log = $log.getInstance('article.edit');

	$log.debug('Edit article #' + $routeParams.id );

	Restangular.one("articles", $routeParams.id).get().then(function(article) {
		$scope.article = article;
	});

	$scope.submitForm = function() {
		$scope.article.put().then(function(result){
			$log.debug(result);
			if(result.success === undefined || !result.success) {
				if(result.title) {
					$scope.errors.title = result.title[0];
				}
				if(result.body) {
					$scope.errors.body = result.body[0];
				}
				if(result.category_id) {
					$scope.errors.category_id = result.category_id[0];
				}
			}
		});
	};

	$scope.errors = {};
}]);