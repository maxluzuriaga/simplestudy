var app = app || {};

app.Guide = Backbone.Model.extend({
	urlRoot: '/guides',
	
	initialize: function() {
		// console.log("New guide");
	},

	create: function(callback) {
		this.set('sections', JSON.stringify(this.sections.toJSON()));

		this.save(null,{success:function(guide, response) {
			callback(response.id);
		}});
	}
});