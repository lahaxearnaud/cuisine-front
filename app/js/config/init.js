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