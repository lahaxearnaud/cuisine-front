app.run(['loader', '$rootScope', '$location', 'baseUrl', function(loader, $rootScope, $location, baseUrl ) {
    loader.execute();

    $rootScope.goArticle = function ( id ) {
      $location.path( '/recipes/' + id );
    };

    $rootScope.baseUrl = baseUrl;
    $rootScope.siteUrl = function(segments) {
        return $rootScope.baseUrl + segments;
    }

	$rootScope.categories = [];
  	$rootScope.getCategory = function(id) {
    	for (var key in $rootScope.categories){
			var element = $rootScope.categories[key];
			console.log(element);
			if(element != null && element.id === id) {
				return element;
        	}
        }

        return null;
    };

    $rootScope.updateCategory = function(id, category) {
    	for (var key in $rootScope.categories){
			var element = $rootScope.categories[key];
			if(element != null && element.id === id) {
				$rootScope.categories[key] = category;
        	}
        }
    };
}]);