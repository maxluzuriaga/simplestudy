var express = require('express'),
    passport = require('passport');

var guides_controller = require('../app/controllers/guides_controller'),
    pages_controller = require('../app/controllers/pages_controller'),
    users_controller = require('../app/controllers/users_controller');

var helper = require('../lib/helper');

// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4

function userOnly(request, response, next) {
  if (request.user) {
    next();
  } else {
    helper.renderError(403, response);
  }
}

function routes(app) {
  app.get('/', pages_controller.index);
  app.get('/api-client', pages_controller.client);

  app.get('/auth', passport.authenticate('google'));
  app.get('/auth/return', passport.authenticate('google', {
    session: false,
    successRedirect: '/',
    failureRedirect: '/failure'
  }));

  var apiRouter = express.Router();

  apiRouter.get('/guides', userOnly, guides_controller.index);
  apiRouter.post('/guides', userOnly, guides_controller.create);
  apiRouter.get('/guides/:guide_id', userOnly, guides_controller.show);

  app.use('/api', apiRouter);

  app.get('*', function(request, response) {
    helper.renderError(404, response);
  });
}

module.exports = routes;