
app.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/recipes/search', {
            templateUrl: 'partials/article/liste.html',
            controller: 'article.search'
        });

        $routeProvider.when('/recipes/:id', {
            templateUrl: 'partials/article/get.html',
            controller: 'article.get'
        });

        $routeProvider.when('/recipes/:id/delete', {
            templateUrl: 'partials/article/delete.html',
            controller: 'article.delete'
        });

        $routeProvider.when('/recipes/:id/edit', {
            templateUrl: 'partials/article/edit.html',
            controller: 'article.edit'
        });

        $routeProvider.when('/recipes', {
            templateUrl: 'partials/article/liste.html',
            controller: 'article.list'
        });
}]);