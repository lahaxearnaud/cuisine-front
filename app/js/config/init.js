app.run(['loader', '$rootScope', '$location', '$log', function(loader, $rootScope, $location, $log) {
        loader.execute();

/**
        $rootScope.setFormScope = function(scope){
            this.formScope = scope;
            if($location.search().query) {
                this.formScope.query = $location.search().query;
            }
        }


**/
        $rootScope.goArticle = function ( id ) {
          $location.path( '/recipes/' + id );
        };
}]);

