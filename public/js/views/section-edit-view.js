var app = app || {};

app.SectionEditView = Backbone.View.extend({
	tagName: "li",

	render: function(file) {
		var template = _.template(file, { section: this.section });
		$(this.el).html(template);

		return this;
	}
});