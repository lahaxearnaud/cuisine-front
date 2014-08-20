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