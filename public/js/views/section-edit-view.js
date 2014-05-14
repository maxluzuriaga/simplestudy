var app = app || {};

app.SectionEditView = Backbone.View.extend({
	tagName: "li",

	events: {
		"click a.delete-section": "removeSection",
		"change input.section-name": "nameChange",
		"keyup input.section-email": "emailChange",
		"blur input.section-email": "hideSuggestions"
	},

	initialize: function() {
		this.users = new app.Users();
	},

	render: function(file) {
		var template = _.template(file, { section: this.section });
		$(this.el).html(template);

		return this;
	},

	sectionMoved: function() {
		var index = $(this.el).index();
		this.section.set('index', index);
	},

	removeSection: function(e) {
		e.preventDefault();
		
		this.parentView.removeSection(this);
	},

	nameChange: function() {
		var name = $(this.el).find("input.section-name").val();
		this.section.set('name', name);
	},

	emailChange: function() {
		this.emailLastChanged = new Date();

		var email = $(this.el).find("input.section-email").val();
		this.section.set('email', email);

		this.users.query = email;

		window.setTimeout(function() {
			if ((new Date() - this.emailLastChanged) >= 300) {
				this.users.fetch({reset: true, success: this.showSuggestions.bind(this)});
			}
		}.bind(this), 300);
	},

	showSuggestions: function() {
		console.log(this.users.models);
	},

	hideSuggestions: function() {
		$(this.el).find(".email-list").css("visibility", "hidden");
	}
});