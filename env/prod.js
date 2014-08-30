if(!location.hostname.match('localhost')) {
	console.log('### PROD ###');
	app.constant('baseUrl', 'http://cuisine.lahaxe.fr/app/');
	app.constant('apiUrl', 'http://api-cuisine.lahaxe.fr/api/v1/');
	app.constant('authToken', 'X-Auth-Token');
}