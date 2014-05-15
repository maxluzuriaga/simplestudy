var crypto = require('crypto'),
    User = require('../models/user'),
    bookshelf = require('bookshelf').PG;

function authorize(identifier, profile, done) {
  // create user if doesn't yet exist, then log them in and redirect to /
  new User({identifier: identifier}).fetch().then(function(user) {
    if (user) {
      // log in user
      done(null, user);
    } else {
      crypto.randomBytes(10, function(ex, buf) {
        var randomString = buf.toString('hex');

        var shasum = crypto.createHash('sha1');
        shasum.update(identifier + profile.displayName + randomString);
        var token = shasum.digest('hex');

        user = new User({
          identifier: identifier,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          authorization_token: token
        });

        user.save().then(function(user) {
          done(null, user);
        });
      });
    }
  });
}

function login(request, response) {
  response.cookie('authorization_token', request.user.get('authorization_token', { maxAge: 900000, httpOnly: false }));
  response.redirect('/');
}

function me(request, response) {
  response.json(200, request.user.omit(['authorization_token', 'identifier']));
}

function _quicksort(array) {
  if (array.length <= 1) {
    return array;
  }

  var pivot = array.splice(Math.floor(array.length/2), 1)[0];
  var less = [];
  var greater = [];

  array.forEach(function(x) {
    if (x.email.length <= pivot.email.length) {
      less.push(x);
    } else {
      greater.push(x);
    }
  });

  return _quicksort(less).concat([pivot]).concat(_quicksort(greater));
}

function find(request, response) {
  var query = request.params.query.replace("_", "\\_") + '%';

  bookshelf.knex('users').where('email', 'LIKE', query).select('email').then(function(emails) {
    response.json(200, _quicksort(emails));
  });
}

exports.authorize = authorize;
exports.login = login;
exports.me = me;
exports.find = find;