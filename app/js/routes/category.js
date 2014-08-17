app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/categories/:id/articles', {
            templateUrl: 'partials/article/liste.html',
            controller: 'category.articles',
        });
}]);