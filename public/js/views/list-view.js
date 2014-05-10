var app = app || {};

app.ListView = Backbone.View.extend({
	el: "#main-wrapper",
	render: function() {
		var mine = new app.Guides();
		mine.context = "mine";

		var shared = new app.Guides();
		shared.context = "shared";

		var _render = function() {
			var template = _.template($("#list-view-template").html(), { mine: mine.models, shared: shared.models });
			this.$el.html(template);
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
	}
});