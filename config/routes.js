var express = require('express');

// var pages_controller = require('../app/controllers/pages_controller');

var helper = require('../lib/helper');

// var Post = require('../app/models/post'),
//     Category = require('../app/models/category');

function adminOnly(request, response, next) {
  if (request.user && request.user.admin) {
    next();
  } else {
    helper.renderError(403, response);
  }
};

// http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4

var router = express.Router();

router.get('*', function(request, response) {
  helper.renderError(404, response);
});

module.exports = router