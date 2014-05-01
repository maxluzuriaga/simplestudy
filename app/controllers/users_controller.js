var passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy,
    crypto = require('crypto'),
    User = require('../models/user');

passport.use(new GoogleStrategy(
  {
    returnURL: 'http://localhost:5000/auth/return',
    realm: 'http://localhost:5000/'
  },
  function(identifier, profile, done) {
    console.log(profile);
    new User({identifier: identifier}).fetch().then(function(user) {
      if (user) {
        // log in user
        console.log(user.toJSON());
        done(null, user);
      } else {
        console.log("CREATING USER");
        console.log(identifier + profile.displayName);
        var shasum = crypto.createHash('sha1');
        shasum.update(identifier + profile.displayName);
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
      }
    });
  }
));

function authorize(request, response) {
  // create user if doesn't yet exist, then log them in and redirect to /
}

exports.authorize = authorize;