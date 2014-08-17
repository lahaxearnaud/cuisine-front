app.
  directive('sidebar', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/sidebar.html'
    };
});

app.
  directive('menu', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/menu.html'
    };
});

 app.
  directive('footer', function() {
    return {
      restrict:'E',
      replace : true,
      templateUrl: '/app/partials/layout/footer.html'
    };
});



app.directive('page', function () {
    return {
        restrict:'E',
        scope: true,
        transclude : true,
        template:'<div>' +
        '<menu></menu>' +
        '<div class="container-fluid">' +
	        '<div class="row">' +
		        '<sidebar></sidebar>' +
		        '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" ng-transclude></div>' +
		        '</div>' +
	        '</div>' +
	        '<footer></footer>' +
        '<div>',
        replace : true
    };
});