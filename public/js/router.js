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
			if ($.cookie('authorization_token') || fragment == "login") {
				if ($.cookie('authorization_token') && !app.currentUser) {
					app.currentUser = new app.User();
					app.currentUser.fetch({success: function() {
						var userControl = new app.UserNavControl();
						userControl.user = app.currentUser;

						userControl.render(function(v) {
							$(".user-control").html(v.el);
							next();
						});
					}});
				} else {
					next();
				}
			} else {
				app.router.navigate("login", { trigger: true });
				return false;
			}
		}
	},

	showView: function(selector, view) {
		if (this.currentView) {
			this.currentView.close();
		}

		this.currentView = view;
		view.render(function(v) {
			$(selector).html(v.el);
			$(document.body).clickify();
		});
	}
});

app.router = new Router();

app.router.on('route:login', function() {
	alert("yo");
});

app.router.on('route:list', function() {
	var listview = new app.ListView();
	app.router.showView("#main-wrapper", listview);
});

app.router.on('route:show-guide', function(id) {
	var guideview = new app.GuideView();
	guideview.guide = new app.Guide({id: id});

	guideview.guide.fetch({success: function() {
		app.router.showView("#main-wrapper", guideview);
	}});
});

app.router.on('route:error', function() {
	alert("Error 404!");
	// TODO: render 404 view
});

Backbone.history.start({pushState: true});
$(document.body).clickify();