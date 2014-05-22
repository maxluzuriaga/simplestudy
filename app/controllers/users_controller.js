var crypto = require('crypto'),
    User = require('../models/user'),
    bookshelf = require('bookshelf').PG,
    googleapis = require('googleapis'),
    OAuth2 = googleapis.auth.OAuth2;

var oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
  process.env.ROOT_URL + 'auth/return' // redirect url
);

function authenticate(request, response) {
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: "profile email"
  });

  response.redirect(url);
}

function authCallback(request, response, next) {
  var code = request.query.code;

  oauth2Client.getToken(code, function(err, tokens) {
    var access_token = tokens.access_token;
    var refresh_token = tokens.refresh_token;

    oauth2Client.credentials = {
      access_token: access_token,
      refresh_token: refresh_token
    };

    googleapis.discover('plus', 'v1').execute(function(err, client) {
      client.plus.people.get({ userId: 'me' }).withAuthClient(oauth2Client).execute(function(err, user_info) {
        new User({google_id: user_info.id}).fetch().then(function(user) {
          if (user) {
            user.save({access_token: access_token, refresh_token: refresh_token}, {patch: true}).then(function() {
              request.user = user;

              next();
            });
          } else {
            var email = user_info.emails[0].value;
            var google_id = user_info.id;
            var fullName = user_info.displayName;
            var image_url = user_info.image.url;
            var domain = user_info.domain;

            crypto.randomBytes(10, function(ex, buf) {
              var randomString = buf.toString('hex');

              var shasum = crypto.createHash('sha1');
              shasum.update(fullName + google_id + randomString);
              var token = shasum.digest('hex');

              user = new User({
                email: email,
                google_id: google_id,
                fullName: fullName,
                image_url: image_url,
                domain: domain,
                authorization_token: token,
                access_token: access_token,
                refresh_token: refresh_token
              });

              user.save().then(function(user) {
                request.user = user;

                next();
              });
            });
          }
        });
      });
    });
  });
}

function login(request, response) {
  response.cookie('authorization_token', request.user.get('authorization_token', { maxAge: 900000, httpOnly: false }));
  response.redirect('/');
}

function me(request, response) {
  response.json(200, request.user.omit(['authorization_token', 'identifier', 'google_id', 'domain', 'access_token', 'refresh_token']));
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

function exists(request, response) {
  var email = request.params.email;

  new User({email: email}).fetch().then(function(user) {
    if (user) {
      response.json(200, {exists: true});
    } else {
      response.json(200, {exists: false});
    }
  });
}

exports.authenticate = authenticate;
exports.authCallback = authCallback;
exports.login = login;
exports.me = me;
exports.find = find;
exports.exists = exists;