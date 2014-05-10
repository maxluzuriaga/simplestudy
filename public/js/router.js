var app = app || {};

var Router = Backbone.Router.extend({
	routes: {
		"": "list",
		"guides/:id": "show-guide",
		"new": "new-guide",

		"*notFound": "error"
	}
});

app.router = new Router();

var listview;

app.router.on('route:list', function() {
	if (listview && listview.rendered) {
		$(".new-button").fadeIn(150);
		$("#new-guide-form").css("overflow", "hidden");
		$("#new-guide-form").animate({opacity: 0.3}, function() {
			$(".new-button").css({position: "static"});
			$(this).css({display: "none"});
		});
		$("#main").removeClass("hidden");
		$("#main").animate({width: 770, opacity: 1.0});
		$("#creation-wrapper").animate({width: 130});
	} else {
		listview = new app.ListView();
		listview.render();
	}
});

app.router.on('route:show-guide', function(id) {
	var guideview = new app.GuideView();
	guideview.guide = new app.Guide({id: id});

	guideview.guide.fetch({success: function() {
		guideview.render();
	}});
});

app.router.on('route:new-guide', function(page) {
	var _slide = function() {
		$(".new-button").css({position: "absolute"});
		$("#new-guide-form").css("position", "static");
		$(".new-button").fadeOut(150);
		$("#new-guide-form").css({display: "block", opacity: 0.3});
		$("#new-guide-form").animate({opacity: 1.0}, function() {
			$(this).css("overflow", "visible");
		});
		$("#main").addClass("hidden");
		$("#main").animate({width: 530, opacity: 0.3});
		$("#creation-wrapper").animate({width: 370});
	}

	if (listview && listview.rendered) {
		_slide();
	} else {
		listview = new app.ListView();
		listview.render();

		window.setTimeout(_slide, 200);
	}
});

app.router.on('route:error', function() {
	alert("Error 404!");
	// TODO: render 404 view
});

Backbone.history.start({pushState: true});
$(document.body).clickify();