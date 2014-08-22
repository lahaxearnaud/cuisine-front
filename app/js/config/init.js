app.run(['loader', '$rootScope', '$location', function(loader, $rootScope, $location ) {
    loader.execute();

    $rootScope.goArticle = function ( id ) {
      $location.path( '/recipes/' + id );
    };
}]);

