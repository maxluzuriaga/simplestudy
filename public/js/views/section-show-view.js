var app = app || {};

app.SectionShowView = Backbone.View.extend({
	events: {
		"click a.approve": "approveSection"
	},

	render: function(callback) {
		app.getTemplate("sections/show", function(file) {
			var template = _.template(file, { section: this.section, guideMine: this.guideMine, hideText: this.hideText });
			$(this.el).html(template);

			callback(this);
		}.bind(this));
	},

	approveSection: function(e) {
		e.preventDefault();

		this.section.setApproved(true, function() {
			console.log(this.section);
		}.bind(this));
	}
});