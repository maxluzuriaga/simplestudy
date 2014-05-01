require('./lib/db').connect();

var server = require ("./lib/server"),
    routes = require("./config/routes");

server.start(routes, __dirname);