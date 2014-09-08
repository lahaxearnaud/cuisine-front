'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('cook', [
    'ngRoute',
    'restangular',
    'angular-loading-bar',
    'ngCookies',
    'ui.gravatar',
    'ui.bootstrap',
    'socialLinks',
    'ui.bootstrap.tpls',
    'angular-blocks',
    'picardy.fontawesome',
    'log.ex.uo',
    'btford.markdown',
    'colorpicker.module',
    'cook.filters',
    'cook.services',
    'cook.directives',
    'cook.controllers'
]);

app.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({
            redirectTo: '/recipes'
        });
}]);

(function() {

    function extendTemplate($templateCache, $compile, $http, $q, $log) {

        function warnMissingBlock(name, src) {
            $log.warn('Failed to find data-block=' + name + ' in ' + src);
        }

        return {
            compile: function(tElement, tAttrs) {
                var src = tAttrs.extendTemplate;
                if (!src) {
                    throw 'Template not specified in extend-template directive';
                }
                // Clone and then clear the template element to prevent expressions from being evaluated
                var $clone = angular.element(tElement.clone());
                tElement.html('');

                var loadTemplate = $http.get(src, {
                    cache: $templateCache
                })
                    .then(function(response) {
                    var $template = angular.element(document.createElement('div')).html(response.data);

                    function override(method, block, attr) {
                        var name = block[0].getAttribute(attr),
                            classes = angular.element($template[0].querySelectorAll('[data-block="' + name + '"]')).attr('class');

                        if (angular.element($template[0].querySelectorAll('[data-block="' + name + '"]'))[method](block).length === 0 && angular.element($template[0].querySelectorAll('[data-extend-template]')).append(block).length === 0) {
                            warnMissingBlock(name, src);
                        }

                        block.attr('class', classes);
                    }

                    angular.forEach($clone.children(), function(el) {
                        var $el = angular.element(el);

                        // Replace overridden blocks
                        if (el.hasAttribute('data-block')) {
                            override('replaceWith', $el, 'data-block');
                        }

                        // Insert prepend blocks
                        if (el.hasAttribute('data-block-prepend')) {
                            override('prepend', $el, 'data-block-prepend');
                        }

                        // Insert append blocks
                        if (el.hasAttribute('data-block-append')) {
                            override('append', $el, 'data-block-append');
                        }

                        // Insert after blocks
                        if (el.hasAttribute('data-block-after')) {
                            override('after', $el, 'data-block-after');
                        }
                        //console.log(el);
                    });

                    return $template;
                }, function() {
                    var msg = 'Failed to load template: ' + src;
                    $log.error(msg);
                    return $q.reject(msg);
                });


                return function($scope, $element) {
                    loadTemplate.then(function($template) {
                        $element.html($template.html());
                        $compile($element.contents())($scope);
                    });
                };
            }
        };
    }

    angular.module('angular-blocks', [])
        .directive('extendTemplate', ['$templateCache', '$compile', '$http', '$q', '$log', extendTemplate]);
}());

app.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.when('/recipes/search', {
            templateUrl: 'partials/article/liste.html',
            controller: 'article.search'
        });

        $routeProvider.when('/recipes/add', {
            templateUrl: 'partials/article/add.html',
            controller: 'article.add'
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
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'user.login',
            publicAccess: true
        });

        $routeProvider.when('/logout', {
            templateUrl: 'partials/home.html',
            controller: 'user.logout'
        });

        $routeProvider.when('/user/profile', {
            templateUrl: 'partials/user/profile.html',
            controller: 'user.profile'
        });

        $routeProvider.when('/user/edit', {
            templateUrl: 'partials/user/edit.html',
            controller: 'user.edit'
        });

        $routeProvider.when('/subscribe', {
            templateUrl: 'partials/subscribe.html',
            controller: 'user.subscribe',
            publicAccess: true
        });
}]);
app.run(['Restangular', '$cookieStore', '$rootScope', '$route', '$location', '$log',
    function(Restangular, $cookieStore, $rootScope, $route, $location, $log) {
        $log = $log.getInstance('authentification');

        // Reload authentification from cookie
        var authentification = $cookieStore.get("authentification");
        if (authentification !== undefined) {
            Restangular.setDefaultHeaders({
                "X-Auth-Token": authentification.token
            });
            $rootScope.authentification = authentification;
            $log.debug('Connected as ' + authentification.username);
        }else{
            $log.debug('Guest user');
            $rootScope.authentification = {
                'token': '',
                'id': 0,
                'username': '',
                'logged': false
            };
        }

        $rootScope.$apply();
}]);

app.run(['$rootScope', '$route', '$location', '$log',
    function($rootScope, $route, $location, $log) {
        $log = $log.getInstance('firewall');

        var routesOpenToPublic = [];
        angular.forEach($route.routes, function(route, path) {
            route.publicAccess && (routesOpenToPublic.push(path));
        });

        isAllowOrRedirect($log, $location, routesOpenToPublic, $location.path(), $rootScope.authentification.logged)

        $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {
            isAllowOrRedirect($log, $location, routesOpenToPublic, $location.path(), $rootScope.authentification.logged)
        });


        $rootScope.$apply();
}]);


function isAllowOrRedirect($log, $location, publicRoutes, current, isLogged) {
    var closedToPublic = (-1 === publicRoutes.indexOf(current));

    if (closedToPublic && !isLogged) {
        $log.debug('Try to access ' + current + ' when no connected');
        $location.path('/login');
    }
}
app.run(['loader', '$rootScope', '$location', 'baseUrl', function(loader, $rootScope, $location, baseUrl ) {
    loader.execute();

    $rootScope.goArticle = function ( id ) {
      $location.path( '/recipes/' + id );
    };

    $rootScope.baseUrl = baseUrl;
    $rootScope.siteUrl = function(segments) {
        return $rootScope.baseUrl + segments;
    }
}]);
app.config(['logExProvider', function(logExProvider) {
    logExProvider.enableLogging(true);
}]);

app.config(['logExProvider', function(logExProvider) {
    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get('$filter');
        var separator = " >> ";
        var format = "hh:mm:ss";
        var now = $filter('date')(new Date(), format);

        return "" + now + (!angular.isString(className) ? "" : " :: " + className) + separator;
    });
}]);
/**
 * Created by arnaud on 10/08/14.
 */

app.run(['Restangular', '$rootScope', '$location', 'authToken', '$cacheFactory', 'loader',
    function(Restangular, $rootScope, $location, authToken, $cacheFactory, loader) {
        Restangular.setDefaultHttpFields({cache: true});
        Restangular.setErrorInterceptor(function (response, deferred, responseHandler, authToken) {
            if(response.status === 401) {
                Restangular.setDefaultHeaders({
                    authToken: ''
                });

                $rootScope.authentification = {
                    'token': '',
                    'id': 0,
                    'username': '',
                    'logged': false
                };

                $location.path('/login');
            }

            return true; // error not handled
        });

        var cache = $cacheFactory.get('$http');
        Restangular.setResponseInterceptor(function(response, operation) {
           if (operation === 'put' || operation === 'post' || operation === 'remove') {
               cache.removeAll();
               loader.execute();
           }

           return response;
       });
}]);


app.config(['RestangularProvider', 'apiUrl',
    function (RestangularProvider, apiUrl) {
    RestangularProvider.setBaseUrl(apiUrl);
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});

        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

            var extractedData;
            if (operation === 'post' && what === 'auth') {
                extractedData = {
                    'token': data.token,
                    'username': data.user.username,
                    'id': data.user.id,
                    'email': data.user.email,
                    'logged': true
                };
            } else if ((operation === "getList" || operation === "search") && what !== 'categories') {
                extractedData = data.data;
                extractedData.meta = {
                    'perPage': data.per_page,
                    'total': data.total,
                    'currentPage': data.current_page,
                    'from': data.from,
                    'to': data.to
                };
            } else {
                extractedData = data;
            }

            return extractedData;
        });

        RestangularProvider.addRequestInterceptor(function (element, operation, what, url) {

            if (operation === 'put') {
                delete element._links;
                delete element.created_at;
                delete element.updated_at;
                delete element.id;

                switch(what) {
                    case 'articles':
                        delete element.author;
                        delete element.category;
                        delete element.indexable;
                    break;

                    default:
                    break;
                }
            }

            return element;
        });

    /**
     * ===============================================
     * User specific WS
     * ===============================================
     */

    RestangularProvider.addElementTransformer('auth', true, function(auth) {
            auth.addRestangularMethod('login', 'post', '');
            auth.addRestangularMethod('logout', 'remove', '');

            return auth;
    });

    RestangularProvider.addElementTransformer('users', true, function(users) {
            users.addRestangularMethod('changePassword', 'post', 'password');
            users.addRestangularMethod('subscribe', 'post', 'subscribe');

            return users;
    });

    RestangularProvider.addElementTransformer('autocomplete', true, function(auth) {
            auth.addRestangularMethod('do', 'get', '');

            return auth;
    });

    RestangularProvider.addElementTransformer('articles', true, function(articles) {
            articles.addRestangularMethod('search', 'get', 'search');
            articles.addRestangularMethod('extract', 'post', 'extractFromUrl');

            return articles;
    });
}]);
if(location.hostname.match('localhost')) {
	console.log('### DEV ###');
	app.constant('baseUrl', 'http://localhost:3333/app/');
	app.constant('apiUrl', 'http://cuisine.dev/api/v1/');
	app.constant('authToken', 'X-Auth-Token');
}

if(!location.hostname.match('localhost')) {
	console.log('### PROD ###');
	app.constant('baseUrl', 'http://cuisine.lahaxe.fr/app/');
	app.constant('apiUrl', 'http://api-cuisine.lahaxe.fr/api/v1/');
	app.constant('authToken', 'X-Auth-Token');
}
app.service('loader', [ 'Restangular', '$rootScope', '$log', function (Restangular, $rootScope, $log) {
	    this.execute = function() {
			if(!$rootScope.authentification.logged) {
					return;
			}

	        $log.debug('Initialisation');
			$log.getInstance('dataLoader');
			    Restangular.all("categories").getList().then(function(categories) {
		        $rootScope.categories = categories;
		        $log.debug('categories loadded');
		    });
	    };
}]);

angular.module('cook.services', []).
  value('version', '0.1');

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

    $scope.category = {
        'name' : '',
        'color' : '',
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
angular.module('cook.controllers', [])
	.controller('main', ['$scope', '$log', function ($scope, $log) {
}]);
app.controller('search.autocomplete', ['$scope', '$http', '$location', '$log', 'Restangular', 
	function ($scope, $http, $location, $log, Restangular) {

	$log = $log.getInstance('search.autocomplete');
	$log.debug('Initiate autocompleter');

	$scope.getArticles = function(val) {
		$log.debug('Texte to autocomplete ' + val);
		return Restangular.all("autocomplete").do({
        	query: val
        }).then(function(res){
	      return res;
	    });
	};

    $scope.searchForm = function() {
        $log.debug("search " + $scope.query);
        $location.search({
            "query" : $scope.query
        })
        $location.path('/recipes/search');
    };

	$scope.display = function ($item) {
    	$log.debug('Select article ' + $item.id);
		$location.path( '/recipes/' + $item.id );
	};
}]);
app.controller('user.login', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log', 'loader',
    function ($scope, Restangular, $cookieStore, $rootScope, $location, $log, loader) {

        $log = $log.getInstance('user.login');

        // if we are already logged we can go home
        if ($rootScope.authentification.logged) {
            $location.path('/home');
        }

        $scope.submitForm = function () {
            $log.debug('Auth form submitted');
            if ($scope.loginForm.$valid) {
                Restangular.all('auth').login($scope.login).then(function (auth) {
                    // set header to the rest client
                    Restangular.setDefaultHeaders({
                        "X-Auth-Token": auth.token
                    });
                    // set auth in a cookie
                    $cookieStore.put("authentification", auth);
                    // set auth in global scope
                    $rootScope.authentification = auth;

                    $log.info('Connection succeeded with user ' + auth.username);

                    loader.execute();

                    // this avoid digest error (@todo dig why this error happen...)
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    // go home
                    $location.path('/app');
                }, function (auth) {
                    $log.warn('Connection failed for user ' + $scope.login.username);
                });
            }
        };
    }
]);

app.controller('user.logout', ['$scope', 'Restangular', '$cookieStore', '$rootScope', '$location', '$log',
    function ($scope, Restangular, $cookieStore, $rootScope, $location, $log) {
        Restangular.all('auth').logout();
        // set header to the rest client
        Restangular.setDefaultHeaders({
            "X-Auth-Token": ''
        });

        // set auth in a cookie
        $cookieStore.remove("authentification");
        // set auth in global scope
        $rootScope
            .authentification.logged = false;
        $rootScope.authentification.token = '';
        $rootScope.authentification.username = '';
        $rootScope.authentification.id = 0;

        $log.info('Logout succeeded');

        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }

        $location.path('/login');
    }
]);

app.controller('user.current', ['$scope',
    function ($scope) {}
]);


app.controller('user.profile', ['$scope',
    function ($scope) {}
]);

app.controller('user.edit', ['$scope', 'Restangular', '$log',
    function ($scope, Restangular, $log) {
        $log = $log.getInstance('user.edit');
        $scope.alert = {
            'type' : '',
            'message' :''
        };

        $scope.errors = {};

        $scope.submitForm = function() {
            $log.debug($scope.user);
            Restangular.all('users').changePassword($scope.user).then(function (result) {
                $log.debug(result);
                if(result.success === true) {
                    $scope.alert.type = 'success';
                    $scope.alert.message = 'Password changed';
                }
            }, function(result) {
                $log.debug(result);

                if(result.data.newPassword) {
                    $scope.errors.newPassword = result.data.newPassword;
                }
                if(result.data.oldPassword) {
                    $scope.errors.oldPassword = result.data.oldPassword;
                }
            });
        }
    }
]);

app.controller('user.subscribe', ['$scope', 'Restangular', '$log',
    function ($scope, Restangular, $log) {
        $log = $log.getInstance('user.subscribe');

        $scope.errors = {};

        $scope.alert = {
            'type' : '',
            'message' :''
        };

        $scope.submitForm = function() {
            $log.debug($scope.user);
            Restangular.all('users').subscribe($scope.user).then(function (result) {
                $log.debug(result);
                if(result.success === true) {
                    $scope.alert.type = 'success';
                    $scope.alert.message = 'Account created';
                }
            }, function(result) {
                $log.debug(result);
                if(result.data.password) {
                    $scope.errors.password = result.data.password;
                }
                if(result.data.email) {
                    $scope.errors.email = result.data.email;
                }
                if(result.data.username) {
                    $scope.errors.username = result.data.username;
                }
            });
        };
    }
]);



/* Filters */

angular.module('cook.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

app.
  directive('sidebar', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/sidebar.html'
    };
});

app.
  directive('menu', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/menu.html'
    };
});

 app.
  directive('footer', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/footer.html'
    };
});



app.directive('page', function () {
    return {
        restrict:'E',
        scope: true,
        transclude : true,
        template:'<div>' +
        '<menu></menu>' +
        '<div class="container-fluid">' +
	        '<div class="row">' +
		        '<sidebar></sidebar>' +
		        '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" ng-transclude></div>' +
		        '</div>' +
	        '</div>' +
	        '<footer></footer>' +
        '<div>',
        replace : true
    };
});
angular.module('cook.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
}]);
