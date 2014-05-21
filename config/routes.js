var express = require('express');

var guides_controller = require('../app/controllers/guides_controller'),
    pages_controller = require('../app/controllers/pages_controller'),
    sections_controller = require('../app/controllers/sections_controller'),
    users_controller = require('../app/controllers/users_controller'),
    Guide = require('../app/models/guide'),
    Section = require('../app/models/section');

var helper = require('../lib/helper');

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

  app.get('/auth', users_controller.authenticate);
  app.get('/auth/return',  users_controller.authCallback, users_controller.login);

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

  apiRouter.param('section_id', function(request, response, next, id) {
    id = parseInt(id);

    new Section({id: id}).fetch().then(function(section) {
      if (section) {
        section.load(['guide', 'user']).then(function(section) {
          request.section = section;
          next();
        });
      } else {
        helper.renderError(404, response);
      }
    });
  });

  apiRouter.get('/users/me', userOnly, users_controller.me);
  apiRouter.get('/users/find/:query', userOnly, users_controller.find);
  apiRouter.get('/users/exists/:email', userOnly, users_controller.exists);

  apiRouter.get('/guides/mine', userOnly, guides_controller.myGuides);
  apiRouter.get('/guides/shared', userOnly, guides_controller.sharedGuides);
  apiRouter.post('/guides', userOnly, guides_controller.create);
  apiRouter.get('/guides/:guide_id', userOnly, guides_controller.show);

  apiRouter.post('/sections/:section_id', userOnly, sections_controller.update);
  apiRouter.post('/sections/:section_id/approve', userOnly, sections_controller.approve);
  apiRouter.post('/sections/:section_id/disapprove', userOnly, sections_controller.disapprove);

  app.use('/api', apiRouter);

  app.get('*', pages_controller.index); // Catch-all to enable backbone url routing
}

module.exports = routes;