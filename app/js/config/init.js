app.run(['loader', '$rootScope', '$location', '$log', function(loader, $rootScope, $location, $log) {
        loader.execute();


        $rootScope.setFormScope= function(scope){
            this.formScope = scope;
            this.formScope.query = $location.search().query;
        }

        $rootScope.searchForm = function() {
            $log.debug("search " + this.formScope.query);
            $location.search({
                "query": this.formScope.query
            })
            $location.path('/recipes/search');
        };
}]);

