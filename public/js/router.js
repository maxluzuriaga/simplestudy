var app = app || {};

var Router = Backbone.Router.extend({
	routes: {
		"": "list"
	}
});

app.router = new Router();

app.router.on('route:list', function() {
	var listview = new app.ListView();
	listview.render();
});

Backbone.history.start({pushState: true});
$(document.body).clickify();