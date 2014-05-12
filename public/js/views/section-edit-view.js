var app = app || {};

app.SectionEditView = Backbone.View.extend({
	tagName: "li",

	events: {
		"click a.delete-section": "removeSection",
		"change input.section-name": "nameChange"
	},

	render: function(file) {
		var template = _.template(file, { section: this.section });
		$(this.el).html(template);

		return this;
	},

	removeSection: function(e) {
		e.preventDefault();
		
		this.parentView.removeSection(this);
	},

	nameChange: function() {
		var name = $(this.el).find("input.section-name").val();
		this.section.set('name', name);
	},

	sectionMoved: function() {
		var index = $(this.el).index();
		this.section.set('index', index);
	}
});