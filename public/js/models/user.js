var app = app || {};

app.User = Backbone.Model.extend({
	urlRoot: '/users',

	url: function() {
		return this.urlRoot + '/me';
	},

	initialize: function() {
		// console.log("New guide");
	}
});