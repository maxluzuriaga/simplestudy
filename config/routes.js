var express = require('express');

var guides_controller = require('../app/controllers/guides_controller'),
    pages_controller = require('../app/controllers/pages_controller'),
    users_controller = require('../app/controllers/users_controller');

var helper = require('../lib/helper');

// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4

function routes(app) {
  app.get('/', pages_controller.index);

  app.get('/authlandingpage', users_controller.authorize);

  var apiRouter = express.Router();

  apiRouter.get('/guides', guides_controller.index);
  apiRouter.get('/guides/:id', guides_controller.show);
  apiRouter.post('/guides', guides_controller.create);

  app.use('/api', apiRouter);

  app.get('*', function(request, response) {
    helper.renderError(404, response);
  });
}

module.exports = routes;