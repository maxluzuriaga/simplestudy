function setup(request, response, next) {
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
}

function finish(request, response, next) {
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
}

exports.setup = setup;
exports.finish = finish;