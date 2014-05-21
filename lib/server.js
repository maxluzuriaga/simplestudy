var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    csrf = require('csurf'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    io = require('socket.io'),
    helper = require('./helper');
var sockets = {};

function start(routes, rootUrl) {
  var app = express();

  var server = http.createServer(app);
  io = io.listen(server, { log: false });
  io.sockets.on('connection', function(socket) {
    socket.on('listening', function(data) {
      if (!sockets[data.category]) {
        sockets[data.category] = [];
      }

      sockets[data.category].push(socket);
    });

    socket.on('disconnect', function() {
      for (var category in sockets) {
        var array = sockets[category];
        var index = array.indexOf(socket);

        if (index != -1) {
          array.splice(array.indexOf(socket), 1);
        }
      }
    });
  });

  app.use(express.static(path.join(rootUrl, 'public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(rootUrl, 'app', 'views'));

  app.use(bodyParser());

  app.use(cookieParser());
  app.use(cookieSession({ secret: 'blah-blah-this-is-my-secret' })); // TODO: switch to redis sessions
  app.use(csrf());

  app.use(function(request, response, next) {
    request.logMessages = [];

    request.addLog = function(log) {
      request.logMessages.push(log);
    }
    request.printLogs = function() {
      request.logMessages.forEach(function(log) {
        console.log(log);
      });
    }

    response.locals.token = request.csrfToken();

    request.startTime = new Date();
    request.sockets = sockets;
    var isAjax = request.headers['x-requested-with'] == 'XMLHttpRequest';

    request.addLog(request.method + ": '" + request.path + "' on " + new Date());

    if (Object.getOwnPropertyNames(request.query).length != 0) {
      request.addLog("  Options: ");
      request.addLog(request.query);
    }

    var password = request.body.password;
    var password_confirmation = request.body.password_confirmation;
    if (request.method == "POST" && (Object.getOwnPropertyNames(request.body).length != 0)) {
      if (password) request.body.password = "[HIDDEN]";
      if (password_confirmation) request.body.password_confirmation = "[HIDDEN]";

      request.addLog("  Data: ");
      request.addLog(request.body);

      request.body.password = password;
      request.body.password_confirmation = password_confirmation;
    }

    request.addLog("  From: " + request.connection.remoteAddress);

    next();
  });

  app.use(function(request, response, next) {
    helper.currentUser(request, function(user) {
      request.user = user;
      response.locals.currentUser = user;
      next();
    });
  });

  app.use(function(request, response, next) {
    if (request.files) {
      request.parsedImages = {};
      var keys = Object.keys(request.files);

      function _parse(index) {
        if (index >= keys.length) {
          next();
          return;
        }

        var file = request.files[keys[index]];

        if (file.type.substring(0,5) == 'image') {
          fs.readFile(file.path, function(err, data) {
            var fileData = {
              name: file.name,
              data: data,
              size: file.size,
              type: file.type
            };

            request.parsedImages[keys[index]] = fileData;

            fs.unlink(file.path, function(err) {
              _parse(index+1);
            });
          });
        } else {
          _parse(index+1);
        }
      }

      _parse(0);
    } else {
      next();
    }
  });

  app.use(function(request, response, next) {
    var _render = response.render;
    response.render = function(view, options, callback) {
      options = options || {};

      if (options.js) {
        response.header('Content-Type', 'application/javascript')
      }

      options.jsURL = options.customJS ? view : undefined;
      _render.call(response, view, options, callback);

      request.addLog("  Rendered 'views/" + view + ".ejs' (" + response.statusCode + ")");
      request.addLog("  Completed in " + (new Date() - request.startTime) + "ms\n");

      request.printLogs();
    };

    var _redirect = response.redirect;
    response.redirect = function(url) {
      _redirect.call(response, url);

      request.addLog("  Redirecting to '" + url + "' (" + response.statusCode + ")");
      request.addLog("  Completed in " + (new Date() - request.startTime) + "ms\n");

      request.printLogs();
    };

    var _json = response.json;
    response.json = function(status, body) {
      _json.call(response, status, body);

      request.addLog("  Rendered JSON (" + response.statusCode + ")");
      request.addLog("  Completed in " + (new Date() - request.startTime) + "ms\n");

      request.printLogs();
    }

    next();
  });

  routes(app);

  var port = process.env.PORT || 8000;
  console.log("Starting application on port " + port + "\n");
  server.listen(port);
}

exports.start = start;