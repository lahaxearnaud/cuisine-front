'use strict';

app.config(['logExProvider', function(logExProvider) {
    logExProvider.enableLogging(true);
}]);

app.config(['logExProvider', function(logExProvider) {
    logExProvider.overrideLogPrefix(function (className) {
        var $injector = angular.injector([ 'ng' ]);
        var $filter = $injector.get('$filter');
        var separator = " >> ";
        var format = "h:mm:ssa";
        var now = $filter('date')(new Date(), format);

        return "" + now + (!angular.isString(className) ? "" : "::" + className) + separator;
    });
}]);