var app = app || {};

app.GuideView = Backbone.View.extend({
	render: function(callback) {
		app.getTemplate("guides/show", function(file) {
			var template = _.template(file, { guide: this.guide });
			$(this.el).html(template);

			callback(this);
		}.bind(this));
	}
});