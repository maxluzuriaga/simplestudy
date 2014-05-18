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

				view.render(function(v) {
					// $(this.el).find("#guide").append(v.el);
					this.sectionViews.push(v);

					done();
				}.bind(this));
			}.bind(this), function() {
				this.sectionViews.forEach(function(view) {
					$(this.el).find("#guide").append(view.el);
				}.bind(this));

				callback(this);
			}.bind(this));
		}.bind(this));
	}
});