var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    csrf = require('csurf'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    io = require('socket.io'),
    helper = require('./helper'),
    chat = require('./chat'),
    log = require('./log')

function start(routes, rootUrl) {
  var app = express();

  var server = http.createServer(app);

  io = io.listen(server, { log: false });
  chat.configure(io.sockets);

  app.use(express.static(path.join(rootUrl, 'public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(rootUrl, 'app', 'views'));

  app.use(bodyParser());

  app.use(cookieParser());
  app.use(cookieSession({ secret: 'blah-blah-this-is-my-secret' })); // TODO: switch to redis sessions
  app.use(csrf());

  app.use(log.setup);

  app.use(function(request, response, next) {
    helper.currentUser(request, function(user) {
      request.user = user;
      response.locals.currentUser = user;
      next();
    });
  });

  app.use(log.finish);

  routes(app);

  var port = process.env.PORT || 8000;
  console.log("Starting application on port " + port + "\n");
  server.listen(port);
}

exports.start = start;