var express = require('express'),
    passport = require('passport');

var guides_controller = require('../app/controllers/guides_controller'),
    pages_controller = require('../app/controllers/pages_controller'),
    users_controller = require('../app/controllers/users_controller'),
    Guide = require('../app/models/guide');

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

  apiRouter.param('guide_id', function(request, response, next, id) {
    id = parseInt(id);

    new Guide({id: id}).fetch().then(function(guide) {
      if (guide) {
        request.guide = guide;
        next();
      } else {
        helper.renderError(404, response);
      }
    });
  });

  apiRouter.get('/guides', userOnly, guides_controller.index);
  apiRouter.post('/guides', userOnly, guides_controller.create);
  apiRouter.get('/guides/:guide_id', userOnly, guides_controller.show);

  app.use('/api', apiRouter);

  app.get('*', function(request, response) {
    helper.renderError(404, response);
  });
}

module.exports = routes;