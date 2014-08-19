app.controller('search.autocomplete', ['$scope', '$http', '$location', function ($scope, $http, $location) {
	$scope.getArticles = function(val) {
	    return $http.get('http://cuisine.dev/api/v1/autocomplete', {
	      params: {
	        query: val
	      }
	    }).then(function(res){
	      return res.data.results;
	    });

	    $scope.query = undefined;

	    $scope.display = function ($item, $model, $label) {
			$location.path( '/recipes/' + $model.id );
		};
	};
}]);