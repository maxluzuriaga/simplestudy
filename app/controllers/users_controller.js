var crypto = require('crypto'),
    User = require('../models/user');

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

exports.authorize = authorize;