var app = app || {};

app.NewGuideView = Backbone.View.extend({
	el: "#creation-wrapper",

	events: {
		"click a.new-button": "show",
		"click a.hide-form": "hide",
	},

	render: function() {
		app.getTemplate("guides/new", function(file) {
			var template = _.template(file, { guide: this.guide });
			this.$el.html(template);
			$(document.body).clickify();
		}.bind(this));
	},

	show: function(e) {
		e.preventDefault();

		$(".new-button").css({position: "absolute"});
		$("#new-guide-form").css("position", "static");
		$(".new-button").fadeOut(150);
		$("#new-guide-form").css({display: "block", opacity: 0});
		$("#new-guide-form").animate({opacity: 1.0}, function() {
			$(this).css("overflow", "visible");
		});
		$("#main").addClass("hidden");
		$("#main").animate({width: 530, opacity: 0.3});
		$("#creation-wrapper").animate({width: 370});

		if ($("#main").height() < $("#creation-wrapper").height()) {
			this.mainHeight = $("#main").height();
			$(".body-wrapper").height($("#creation-wrapper").height() + 40)
			$("#main").height($("#creation-wrapper").height())
		};
	},

	hide: function(e) {
		// TODO: confirm close, if stuff has been entered into form
		e.preventDefault();

		$(".new-button").fadeIn(150);
		$("#new-guide-form").css("overflow", "hidden");
		$("#new-guide-form").animate({opacity: 0}, function() {
			$(".new-button").css({position: "static"});
			$(this).css({display: "none"});
		});
		$("#main").removeClass("hidden");
		$("#main").animate({width: 770, opacity: 1.0});
		$("#creation-wrapper").animate({width: 130});

		if (this.mainHeight) {
			$(".body-wrapper").animate({height: this.mainHeight + 40});
			$("#main").height(this.mainHeight);
		}
	}
});