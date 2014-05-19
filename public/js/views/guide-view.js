var app = app || {};

app.GuideView = Backbone.View.extend({
	render: function(callback) {
		app.getTemplate("guides/show", function(file) {
			var template = _.template(file, { guide: this.guide });
			$(this.el).html(template);

			this.sectionViews = [];

			app.asyncForEach(this.guide.sections.models, function(section, done) {
				var view = new app.SectionShowView();
				view.section = section;
				view.guideMine = this.guide.get('mine');
				view.hideText = this.guide.get('hideText');

				this.sectionViews.push(view);

				view.render(done);
			}.bind(this), function() {
				this.sectionViews.forEach(function(view) {
					$(this.el).find("#guide").append(view.el);
				}.bind(this));

				callback(this);

				$("article.section.mine div.section-text").editable({
					inlineMode: false,
					buttons: ["bold", "italic", "underline", "strikeThrough",  "fontSize", "color", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent", "createLink", "insertImage", "undo", "redo", "save"]
				});
			}.bind(this));
		}.bind(this));
	},

	beforeClose: function() {
		this.sectionViews.forEach(function(view) {
			view.close();
		});
	}
});