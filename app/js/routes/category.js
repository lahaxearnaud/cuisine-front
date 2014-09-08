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

        $routeProvider.when('/categories/:id/edit', {
            templateUrl: 'partials/category/edit.html',
            controller: 'categories.edit',
        });

        $routeProvider.when('/categories/:id/delete', {
            templateUrl: 'partials/category/delete.html',
            controller: 'categories.delete',
        });
}]);