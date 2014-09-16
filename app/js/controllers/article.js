app.controller('article.list', ['$scope', 'Restangular', '$routeParams', '$log',
    function ($scope, Restangular, $routeParams, $log) {

    $log = $log.getInstance('article.list');

    $scope.currentPage = 1;
    if($routeParams.page) {
        $scope.currentPage = $routeParams.page;
    }

    $log.debug('Page ' + $scope.currentPage );

    Restangular.all("articles").getList({'page': $scope.currentPage}).then(function(articles) {
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
        Restangular.all("articles").getList({
            'page': $scope.currentPage
        }).then(function(articles) {
            $scope.articles = articles;
        });
    };
}]);

app.controller('article.uncategorize', ['$scope', 'Restangular', '$routeParams', '$log',
    function ($scope, Restangular, $routeParams, $log) {

    $log = $log.getInstance('article.list');

    $scope.currentPage = 1;
    if($routeParams.page) {
        $scope.currentPage = $routeParams.page;
    }

    $log.debug('Page ' + $scope.currentPage );

    Restangular.all("articles").noCategory({'page': $scope.currentPage}).then(function(articles) {
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
        Restangular.all("articles").noCategory({
            'page': $scope.currentPage
        }).then(function(articles) {
            $scope.articles = articles;
        });
    };
}]);

app.controller('article.get', ['$rootScope', '$scope', 'Restangular', '$routeParams', '$log', 
    function ($rootScope, $scope, Restangular, $routeParams, $log) {
    $log = $log.getInstance('article.get');

    $log.debug('Get article #' + $routeParams.id );

    $scope.currentPage = 1;
    if($routeParams.page) {
        $scope.currentPage = $routeParams.page;
    }

    $scope.errors = {};
    $scope.alert = '';

    var updateNotes = function (page) {
        $scope.article.getList('notes', {
            'page' : $scope.currentPage
        }).then(function(notes) {
            $scope.article.notes = notes;
            $scope.totalItems = notes.meta.total;
            $scope.itemsPerPage = notes.meta.perPage;
        });
    };

    $scope.setPage = function (pageNumber) {
        $scope.currentPage = pageNumber;
        $log.debug('Change to  ' + pageNumber );
    };

    $scope.pageChanged = function() {
        $log.debug('Page changed to: ' + $scope.currentPage);
        updateNotes($scope.currentPage);
    };

    $scope.submitForm = function() {
        $log.debug($scope.note.body);
        Restangular.all('notes').post({
            'article_id': $scope.article.id,
            'user_id': $scope.authentification.id,
            'body': $scope.note.body,
        }).then(function(result) {
            if(result.success === undefined || !result.success) {
                if(result.body) {
                    $scope.errors.body = result.body[0];
                }
            } else {
                updateNotes($scope.currentPage);
                $scope.note.body = '';
                $scope.alert = "Note added";
            }
        });
    }

    Restangular.one("articles", $routeParams.id).get().then(function(article) {
        $scope.article = article;
        updateNotes($scope.currentPage);
    });

    $scope.changeQuantity = function(currentYield) {
        var ratio = currentYield / $scope.yieldInitial;
        for(var i = 0; i < $scope.quantities.length; i++) {
            $scope.quantities[i].text($scope.quantitiesInitial[i] * ratio);
        }
        $scope.currentYield = $scope.yieldInitial * ratio;
        $scope.yield.text($scope.currentYield);
    }

    $scope.parse = function() {
        var domArticle = $('.recipe-body');
        $scope.yield = $('strong', domArticle);
        $scope.yieldInitial = parseInt($scope.yield.text());
        $scope.currentYield = $scope.yieldInitial;
        $scope.quantities = $('em', domArticle);
        $scope.quantitiesInitial = new Array();
        for(var i = 0; i < $scope.quantities.length; i++) {
            $scope.quantities[i] = $($scope.quantities[i]);
            $scope.quantitiesInitial[i] = parseInt($scope.quantities[i].text());
        }
    }

    $scope.yields = _.range(1, 15);
    $scope.currentYield = 1;

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
        $log.debug(article );
    });

    $scope.submitForm = function() {
        $scope.article.put().then(function(result){
            if(result.success === undefined || !result.success) {
                if(result.title) {
                    $scope.errors.title = result.title[0];
                }
                if(result.body) {
                    $scope.errors.body = result.body[0];
                }
                if(result.image) {
                    $scope.errors.image = result.image[0];
                }
                if(result.category_id) {
                    $scope.errors.category_id = result.category_id[0];
                }
                $log.debug('Validation errors' + $scope.errors);
            } else {
                $log.debug('Edit of #' + $routeParams.id + ' OK ');
            }
        });
    };

    $scope.errors = {};
}]);

app.controller('article.search', ['$rootScope', '$scope', 'Restangular', '$routeParams', '$log', '$location',
    function ($rootScope, $scope, Restangular, $routeParams, $log, $location) {

    $log = $log.getInstance('article.search');

    var page = 1;
    if($routeParams.page) {
        page = $routeParams.page;
    }
    $log.debug('Page ' + page );

    var query = $location.search().query;

    Restangular.all("articles").search({
        'query': query
    }).then(function(articles) {
        $scope.articles = articles;
    });
}]);

app.controller('article.add', ['$rootScope', '$scope', 'Restangular', '$routeParams', '$log', '$location',
    function ($rootScope, $scope, Restangular, $routeParams, $log, $location) {

    $log = $log.getInstance('article.add');

    $log.debug('Add article');

    $scope.urlExtract = function() {
        if(!this.formScope.article.title && !this.formScope.article.body) {
            Restangular.all('articles').extract({
                'url': this.formScope.article.url,
                'markdown': true
            }).then(function(data) {
                $scope.article.title = data.title;
                $scope.article.body = data.body;
            });
        }
    }

    $scope.setFormScope= function(scope){
        this.formScope = scope;
    }

    $scope.submitForm = function() {
        this.formScope.article.author_id = $rootScope.authentification.id;
        Restangular.all('articles').post(this.formScope.article).then(function(result){
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
                $log.debug('Validation errors' + $scope.errors);
            } else {
                $log.debug('Post added ! #' + result.id);
                $location.path("/recipes/" + result.id);
            }
        });
    };

    $scope.errors = {};
}]);


