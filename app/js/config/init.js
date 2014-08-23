app.run(['loader', '$rootScope', '$location', function(loader, $rootScope, $location ) {
    loader.execute();

    $rootScope.goArticle = function ( id ) {
      $location.path( '/recipes/' + id );
    };

    $rootScope.baseUrl = 'http://localhost:3333/';
    $rootScope.siteUrl = function(segments) {
        return $rootScope.baseUrl + segments;
    }
}]);