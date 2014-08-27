/**
 * Created by arnaud on 10/08/14.
 */
app.run(['Restangular', '$rootScope', '$location',
    function(Restangular, $rootScope, $location) {
        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            if(response.status === 401) {
                Restangular.setDefaultHeaders({
                    "X-Auth-Token": ''
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
}]);


app.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl('http://cuisine.dev/api/v1/');
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