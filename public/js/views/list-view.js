var app = app || {};

app.ListView = Backbone.View.extend({
	el: "#main-wrapper",

	events: {
		"click a.first-guide": "showform",
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

				this.newGuide = new app.NewGuideView();
				this.newGuide.guide = new app.Guide();
				this.newGuide.render();
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
		this.newGuide.show(e);
	},

	hideform: function(e) {
		this.newGuide.hide(e);
	}
});