var app = app || {};

app.ChatView = Backbone.View.extend({
	initialize: function() {
		if (!app.socket) {
			app.socket = io.connect('/');
		}
	},

	render: function(callback) {
		app.getTemplate("guides/chat", function(file) {
			var template = _.template(file, { guide: this.guide });
			$(this.el).html(template);

			callback(this);

			app.socket.emit('enter', { id: this.guide.id, token: $.cookie('authorization_token') });
			app.socket.on('existing users', function(data) {
				console.log(data);
			});
			app.socket.on('user entered', function(data) {
				console.log(data);
			});
			app.socket.on('user left', function(data) {
				console.log(data);
			});
		}.bind(this));
	},

	beforeClose: function() {
		app.socket.emit('leave');
	}
});