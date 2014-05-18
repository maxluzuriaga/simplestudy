var app = app || {};

app.GuideView = Backbone.View.extend({
	render: function(callback) {
		app.getTemplate("guides/show", function(file) {
			var template = _.template(file, { guide: this.guide });
			$(this.el).html(template);

			app.asyncForEach(this.guide.sections.models, function(section, next) {
				var view = new app.SectionShowView();
				view.section = section;
				view.guideMine = this.guide.get('mine');

				view.render(function(v) {
					$(this.el).find("#guide").append(v.el);

					next();
				}.bind(this));
			}.bind(this), function() {
				callback(this);
			}.bind(this));
		}.bind(this));
	}
});