var app = app || {};

app.ListView = Backbone.View.extend({
	el: "#main-wrapper",

	events: {
		"click a.new-button": "showform",
		"click a.hide-form": "hideform",
		"click #main.hidden": "hideform"
	},

	render: function() {
		var mine = new app.Guides();
		mine.context = "mine";
		mine.comparator = function(item) {
			return item.get('created_date');
		};

		var shared = new app.Guides();
		shared.context = "shared";
		shared.comparator = function(item) {
			return item.get('edited_date');
		};

		var _render = function() {
			app.getTemplate("guides/list", function(file) {
				var template = _.template(file, { mine: mine.models, shared: shared.models });
				this.$el.html(template);
				this.rendered = true;
				$(document.body).clickify();
			}.bind(this));
		}.bind(this);

		mine.fetch({success: function() {
			mine.finished = true;
			if (shared.finished) {
				_render();
			}
		}});

		shared.fetch({success: function() {
			shared.finished = true;
			if (mine.finished) {
				_render();
			}
		}});
	},

	showform: function(e) {
		e.preventDefault();

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
	},

	hideform: function(e) {
		// TODO: confirm close, if stuff has been entered into form
		e.preventDefault();

		$(".new-button").fadeIn(150);
		$("#new-guide-form").css("overflow", "hidden");
		$("#new-guide-form").animate({opacity: 0.3}, function() {
			$(".new-button").css({position: "static"});
			$(this).css({display: "none"});
		});
		$("#main").removeClass("hidden");
		$("#main").animate({width: 770, opacity: 1.0});
		$("#creation-wrapper").animate({width: 130});
	}
});