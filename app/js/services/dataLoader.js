app.service('loader', [ 'Restangular', '$rootScope', '$log', function (Restangular, $rootScope, $log) {
	    this.execute = function() {
			if(!$rootScope.authentification.logged) {
					return;
			}

	        $log.debug('Initialisation');
			$log.getInstance('dataLoader');

			Restangular.all("categories").getList().then(function(categories) {
		        $rootScope.categories = categories;
		        $log.debug('categories loadded');
		    });

			Restangular.all("articles").existNoCategory().then(function(result) {
		        $rootScope.existNoCategory = result.count;
		        $log.debug('Bool no categories loadded');
		    });
	    };
}]);
