var app = app || {};

app.EmailSuggestionList = Backbone.View.extend({
	events: {

	},

	initialize: function() {
		this.users = new app.Users();
	},

	render: function(callback) {
		app.getTemplate("users/email-list", function(file) {
			var template = _.template(file, { users: this.users.models });
			$(this.el).html(template);

			callback(this);
		}.bind(this));
	},

	query: function(email) {
		this.users.query = email;
		this.users.fetch({reset: true, success: this.showSuggestions.bind(this)});
	},

	showSuggestions: function() {
		$(this.el).parent().css("display", "block");
		console.log(this.users.models);
	}
});