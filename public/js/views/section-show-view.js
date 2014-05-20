var app = app || {};

app.SectionShowView = Backbone.View.extend({
	events: {
		"click a.approve": "approveSection"
	},

	render: function(callback) {
		app.getTemplate("sections/show", function(file) {
			var timeAgo = moment(this.section.get('edited_date')).fromNow();
			var template = _.template(file, { section: this.section, guideMine: this.guideMine, hideText: this.hideText, timeAgo: timeAgo });
			$(this.el).html(template);

			callback(this);

			if (this.section.get('mine')) {
				$(this.el).find("div.section-text").editable({
					inlineMode: false,
					autosave: true,
					beforeSaveCallback: this.beforeSave,
					saveURL: "/sections/" + this.section.get('id'),
					afterSaveCallback: this.afterSave,
					buttons: ["bold", "italic", "underline", "strikeThrough",  "fontSize", "color", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent", "createLink", "insertImage", "undo", "redo", "save"]
				});
			}
		}.bind(this));
	},

	beforeSave: function() {
		console.log("saving...");
	},

	afterSave: function() {
		console.log("saved!");
	},

	approveSection: function(e) {
		e.preventDefault();

		this.section.setApproved(true, function() {
			console.log(this.section);
		}.bind(this));
	}
});