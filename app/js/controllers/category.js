app.controller('category.articles', ['$scope', 'Restangular', '$routeParams', '$log', '$location',
    function ($scope, Restangular, $routeParams, $log, $location) {

    $log = $log.getInstance('category.articles');

    var category_id = $routeParams.id;
    if(!category_id) {
        $location.path('/app');
    }
    $log.debug('Category : ' + category_id);

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

app.controller('categories.add', ['$rootScope', '$scope', 'Restangular', '$log', '$location',
    function ($rootScope, $scope, Restangular, $log, $location) {

    $log = $log.getInstance('categories.add');

    $log.debug('Add categories');

    $scope.submitForm = function() {
        Restangular.all('categories').post($scope.category).then(function(result){
            if(result.success === undefined || !result.success) {
                if(result.name) {
                    $scope.errors.name = result.name[0];
                }
                if(result.color) {
                    $scope.errors.color = result.color[0];
                }

                $log.debug('Validation errors' + $scope.errors);
            } else {
                $log.debug('Post added ! #' + result.id);
                $scope.category.id = result.id;
                $rootScope.categories[result.id] = $scope.category;
                $location.path("/recipes");
            }
        });
    };

    $scope.reloadColor = function() {
        $scope.category.color = randomColor();
    }

    $scope.category = {
        'name' : '',
        'color' : randomColor(),
        'user_id': $rootScope.authentification.id,
        'id': 0
    };

    $scope.errors = {};
}]);

app.controller('categories.edit', ['$rootScope', '$scope', 'Restangular', '$routeParams', '$log', '$location',
    function ($rootScope, $scope, Restangular, $routeParams, $log, $location) {

    $log = $log.getInstance('categories.edit');

    var category_id = $routeParams.id;
    if(!category_id) {
        $location.path('/app');
    }
    $log.debug('Edit category : ' + category_id);

    Restangular.one("categories", category_id).get().then(function(category) {
        $scope.category = category;
    });

    $scope.submitForm = function() {
        delete $scope.category.user;
        $scope.category.put().then(function(result){
            if(result.success === undefined || !result.success) {
                if(result.name) {
                    $scope.errors.name = result.name[0];
                }
                if(result.color) {
                    $scope.errors.color = result.color[0];
                }

                $log.debug('Validation errors' + $scope.errors);
            } else {
                $log.debug('Category edited #' + result.id);
                $rootScope.categories[result.id] = $scope.category;
                $location.path("/recipes");
            }
        });
    };

    $scope.errors = {};
}]);

app.controller('categories.delete', ['$scope', 'Restangular', '$routeParams', '$log', '$location', '$rootScope',
    function ($scope, Restangular, $routeParams, $log, $location, $rootScope) {
    $log = $log.getInstance('category.delete');

    $log.debug('Delete category #' + $routeParams.id );

    Restangular.one("categories", $routeParams.id).get().then(function(category) {
        $scope.category = category;
    });

    $scope.submitForm = function() {
        $scope.category.remove();
        delete $rootScope.categories[$routeParams.id];
        $location.path('/recipes');
    };
}]);