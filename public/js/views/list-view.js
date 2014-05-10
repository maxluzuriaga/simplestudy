var app = app || {};

app.ListView = Backbone.View.extend({
	el: "#main-wrapper",
	render: function() {
		var template = _.template($("#list-view-template").html());
		this.$el.html(template);
	}
});