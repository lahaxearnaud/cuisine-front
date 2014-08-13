/**
 * Created by arnaud on 10/08/14.
 */
app.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setBaseUrl('http://cuisine.dev/api/v1/');
    RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});

    RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {
        return true; // error not handled
    });

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
        } else if (operation === "getList") {
            extractedData = data.data;
            extractedData.meta = {
                'perPage': data.per_page,
                'total': data.total,
                'currentPage': data.current_page,
                'from': data.from,
                'to': data.to
            };
        } else {
            extractedData = data.data;
        }

        return extractedData;
    });
}]);