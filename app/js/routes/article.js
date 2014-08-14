
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/recipes/:id', {
            templateUrl: 'partials/article/get.html',
            controller: 'article.get'
        });

        $routeProvider.when('/recipes', {
            templateUrl: 'partials/article/liste.html',
            controller: 'article.list'
        });
}]);