var app = app || {};

var Router = Backbone.Router.extend({
	routes: {
		"": "list",
		"guides/:id": "show-guide",
		"login": "login",

		"*notFound": "error"
	},

	before: {
		"*any": function(fragment, args, next) {
			if ($.cookie('authorization_token') ||  fragment == "login") {
				next();
			} else {
				app.router.navigate("login", { trigger: true });
				return false;
			}
		}
	}
});

app.router = new Router();

app.router.on('route:login', function() {
	alert("yo");
});

app.router.on('route:list', function() {
	var listview = new app.ListView();
	listview.render();
});

app.router.on('route:show-guide', function(id) {
	var guideview = new app.GuideView();
	guideview.guide = new app.Guide({id: id});

	guideview.guide.fetch({success: function() {
		guideview.render();
	}});
});


app.router.on('route:error', function() {
	alert("Error 404!");
	// TODO: render 404 view
});

Backbone.history.start({pushState: true});
$(document.body).clickify();