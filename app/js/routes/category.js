app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/categories/:id/articles', {
            templateUrl: 'app/partials/article/liste.html',
            controller: 'category.articles'
        });

        $routeProvider.when('/categories/add', {
            templateUrl: 'app/partials/category/add.html',
            controller: 'categories.add'
        });

        $routeProvider.when('/categories/:id/edit', {
            templateUrl: 'app/partials/category/edit.html',
            controller: 'categories.edit'
        });

        $routeProvider.when('/categories/:id/delete', {
            templateUrl: 'app/partials/category/delete.html',
            controller: 'categories.delete'
        });
}]);