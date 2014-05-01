var express = require('express'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy;

var guides_controller = require('../app/controllers/guides_controller'),
    pages_controller = require('../app/controllers/pages_controller'),
    users_controller = require('../app/controllers/users_controller');

var helper = require('../lib/helper');

// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4

passport.use(new GoogleStrategy(
  {
    returnURL: 'http://localhost:5000/auth/return',
    realm: 'http://localhost:5000/'
  },
  function(identifier, profile, done) {
    console.log(identifier);
    console.log(profile);
    user = {};
    done(null, user);
  }
));

function routes(app) {
  app.get('/', pages_controller.index);

  app.get('/auth', passport.authenticate('google'));
  app.get('/auth/return', passport.authenticate('google', {
    session: false,
    successRedirect: '/',
    failureRedirect: '/failureb'
  }));

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