var app = app || {};

app.Section = Backbone.Model.extend({
	urlRoot: '/sections',

	initialize: function() {
		// console.log("New guide");
	},

	validate: function(attrs, options) {
		var err = [];

		if (!attrs.name || attrs.name.length == 0) {
			err.push({ selector: ".section-name", msg: "Enter a name for this section." });
		}

		if (!this.emailValid) {
			err.push({ selector: ".section-email", msg: "Enter a valid email." });
		}

		if (err.length > 0) {
			return err;
		}
	}
});