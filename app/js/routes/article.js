
app.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/recipes/search', {
            templateUrl: 'app/partials/article/liste.html',
            controller: 'article.search'
        });

        $routeProvider.when('/recipes/add', {
            templateUrl: 'app/partials/article/add.html',
            controller: 'article.add'
        });

        $routeProvider.when('/recipes/uncategorize', {
            templateUrl: 'app/partials/article/liste.html',
            controller: 'article.uncategorize'
        });

        $routeProvider.when('/recipes/:id', {
            templateUrl: 'app/partials/article/get.html',
            controller: 'article.get'
        });

        $routeProvider.when('/recipes/:id/delete', {
            templateUrl: 'app/partials/article/delete.html',
            controller: 'article.delete'
        });

        $routeProvider.when('/recipes/:id/edit', {
            templateUrl: 'app/partials/article/edit.html',
            controller: 'article.edit'
        });

        $routeProvider.when('/recipes', {
            templateUrl: 'app/partials/article/liste.html',
            controller: 'article.list'
        });
}]);