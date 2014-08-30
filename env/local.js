if(location.hostname.match('localhost')) {
	console.log('### DEV ###');
	app.constant('baseUrl', 'http://localhost:3333/app/');
	app.constant('apiUrl', 'http://cuisine.dev/api/v1/');
	app.constant('authToken', 'X-Auth-Token');
}
