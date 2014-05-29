var io = require('socket.io'),
    User = require('../app/models/user');

var chatSockets = {};

function enterChat(data) {
  new User({authorization_token: data.token}).fetch().then(function(user) {
    if (user) {
      this.user = user;
      this.guideID = data.id;

      var existing = chatSockets[data.id];

      if (existing) {
        existing.forEach(function(socket) {
          socket.emit('user entered', { user: user.renderJSON() });
        });

        this.emit('existing users', existing.map(function(socket) {
          return socket.user.renderJSON();
        }));

        chatSockets[data.id].push(this);
      } else {
        chatSockets[data.id] = [this];
      }
    }
  }.bind(this));
}

function leaveChat() {
  var sockets = chatSockets[this.guideID];
  var index = sockets.indexOf(this);

  if (index != -1) {
    sockets.splice(index, 1);
  }

  sockets.forEach(function(socket) {
    socket.emit('user left', { user: this.user.renderJSON() });
  }.bind(this));
}

function configure(sockets) {
  sockets.on('connection', function(socket) {
    socket.on('enter', enterChat.bind(socket));

    socket.on('disconnect', leaveChat.bind(socket));
    socket.on('leave', leaveChat.bind(socket));
  });
}

exports.configure = configure;