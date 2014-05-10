var app = app || {};

app.GuideView = Backbone.View.extend({
	el: "#main-wrapper",
	render: function() {
		app.getTemplate("guides/show", function(file) {
			var template = _.template(file, { guide: this.guide });
			this.$el.html(template);
			$(document.body).clickify();
		}.bind(this));
	}
});