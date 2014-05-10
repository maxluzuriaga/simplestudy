var app = app || {};

var Router = Backbone.Router.extend({
	routes: {
		"": "list",

		"*notFound": "error"
	}
});

app.router = new Router();

app.router.on('route:list', function() {
	var listview = new app.ListView();
	listview.render();
});

app.router.on('route:error', function() {
	alert("Error 404!");
	// TODO: render 404 view
});

Backbone.history.start({pushState: true});
$(document.body).clickify();