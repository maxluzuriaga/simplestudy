var server = require ("./lib/server"),
    db = require("./lib/db"),
    routes = require("./config/routes");

db.connect();
server.start(routes, __dirname);