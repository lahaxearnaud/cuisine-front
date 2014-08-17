app.controller('category.articles', ['$scope', 'Restangular', '$routeParams', '$log', '$location',
    function ($scope, Restangular, $routeParams, $log, $location) {

    $log = $log.getInstance('category.articles');

    var category_id = $routeParams.id;
    if(!category_id) {
        $location.path('/app');
    }
    $log.debug('Category : ' + $scope.category_id);

    $scope.currentPage = 1;
    if($routeParams.page) {
        $scope.currentPage = $routeParams.page;
    }
    $log.debug('Page ' + $scope.currentPage );

    Restangular.one("categories", category_id).getList('articles', {
            'page': $scope.currentPage
        }).then(function(articles) {
        $scope.articles = articles;
        $scope.totalItems = articles.meta.total;
        $scope.itemsPerPage = articles.meta.perPage;
    });

    $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
        $log.debug('Change to  ' + pageNumber );
    };

    $scope.pageChanged = function() {
        $log.debug('Page changed to: ' + $scope.currentPage);
        Restangular.one("categories", category_id).getList('articles', {
            'page': $scope.currentPage
        }).then(function(articles) {
            $scope.articles = articles;
        });
    };
}]);