/**
 * Created by arnaud on 10/08/14.
 */
var refreshAccesstoken = function () {
    var deferred = $q.defer();

    // Refresh access-token logic

    return deferred.promise;
};


app.config(function (RestangularProvider) {
    console.log('Restangular OK');
    RestangularProvider.setBaseUrl('http://cuisine.dev/api/v1/');
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    RestangularProvider.setDefaultHeaders({"X-Auth-Token": "x-restangular"});

    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {
        if (response.status === 403) {
            refreshAccesstoken().then(function () {
                // Repeat the request and then call the handlers the usual way.
                $http(response.config).then(responseHandler, deferred.reject);
                // Be aware that no request interceptors are called this way.
            });

            return false; // error handled
        }

        return true; // error not handled
    });
})
