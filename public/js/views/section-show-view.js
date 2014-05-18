var app = app || {};

app.SectionShowView = Backbone.View.extend({
	events: {
	},

	render: function(callback) {
		app.getTemplate("sections/show", function(file) {
			var template = _.template(file, { section: this.section, guideMine: this.guideMine });
			$(this.el).html(template);

			callback(this);
		}.bind(this));
	}
});