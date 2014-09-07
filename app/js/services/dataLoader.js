app.service('loader', [ 'Restangular', '$rootScope', '$log', function (Restangular, $rootScope, $log) {
	    this.execute = function() {
			if(!$rootScope.authentification.logged) {
					return;
			}

	        $log.debug('Initialisation');
			$log.getInstance('dataLoader');
			    Restangular.all("categories").getList().then(function(categories) {
			    var categoriesTableByID = [];
			    _(categories).forEach(function(value) {
			    	categoriesTableByID[value.id] = value;
			    });
		        $rootScope.categories = categoriesTableByID;
		        $log.debug('categories loadded');
		    });
	    };
}]);
