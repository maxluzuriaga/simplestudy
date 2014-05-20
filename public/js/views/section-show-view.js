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
					autosaveInterval: 2000,
					beforeSaveCallback: this.beforeSave.bind(this),
					saveURL: "/sections/" + this.section.get('id'),
					afterSaveCallback: this.afterSave.bind(this),
					buttons: ["bold", "italic", "underline", "strikeThrough",  "fontSize", "color", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent", "createLink", "insertImage", "undo", "redo", "save"]
				});
			}

			window.setInterval(this.updateEditedText.bind(this), 60000)
		}.bind(this));
	},

	beforeSave: function() {
		this.updateEditedText("saving...");
	},

	afterSave: function() {
		this.section.set('edited_date', new Date());
		window.setTimeout(this.updateEditedText.bind(this), 350);
	},

	updateEditedText: function(text) {
		if (!text) {
			text = "last edited " + moment(this.section.get('edited_date')).fromNow();
		}

		$(this.el).find(".edited-date").html(text);
	},

	approveSection: function(e) {
		e.preventDefault();

		this.section.setApproved(true, function() {
			console.log(this.section);
		}.bind(this));
	}
});