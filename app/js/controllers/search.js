app.controller('search.autocomplete', ['$scope', '$http', '$location', '$log', 
	function ($scope, $http, $location, $log) {

	$log = $log.getInstance('search.autocomplete');
	$log.debug('Initiate autocompleter');

	$scope.getArticles = function(val) {
		$log.debug('Texte to autocomplete ' + val);
	    return $http.get('http://cuisine.dev/api/v1/autocomplete', {
	      params: {
	        query: val
	      }
	    }).then(function(res){
	      return res.data;
	    });

	    $scope.query = undefined;
	};

    $scope.searchForm = function() {
        $log.debug("search " + $scope.query);
        $location.search({
            "query": $scope.query
        })
        $location.path('/recipes/search');
    };

	$scope.display = function ($item) {
    	$log.debug('Select article ' + $item.id);
		$location.path( '/recipes/' + $item.id );
	};
}]);