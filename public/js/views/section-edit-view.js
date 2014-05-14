var app = app || {};

app.SectionEditView = Backbone.View.extend({
	tagName: "li",

	events: {
		"click a.delete-section": "removeSection",
		"change input.section-name": "nameChange",
		"keyup input.section-email": "emailChange",
		"blur input.section-email": "hideSuggestions"
	},

	render: function(callback) {
		app.getTemplate("sections/edit", function(file) {
			var template = _.template(file, { section: this.section });
			$(this.el).html(template);

			this.suggestionList = new app.EmailSuggestionList();

			this.suggestionList.render(function(v) {
				$(this.el).find(".email-list").html(v.el);

				callback(this);
			}.bind(this));
		}.bind(this));
	},

	beforeClose: function() {
		this.suggestionList.close();
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

		window.setTimeout(function() {
			if ((new Date() - this.emailLastChanged) >= 300) {
				this.suggestionList.query(email);
			}
		}.bind(this), 300);
	},

	hideSuggestions: function() {
		$(this.suggestionList.el).parent().css("display", "none");
	}
});