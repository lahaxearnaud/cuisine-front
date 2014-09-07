app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/categories/:id/articles', {
            templateUrl: 'partials/article/liste.html',
            controller: 'category.articles',
        });

        $routeProvider.when('/categories/add', {
            templateUrl: 'partials/category/add.html',
            controller: 'categories.add',
        });
}]);