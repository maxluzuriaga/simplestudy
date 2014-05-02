var ejs = require('ejs'),
    fs = require('fs'),
    dateformat = require('dateformat'),
    User = require('../app/models/user');

function renderPartial(location, data, handler) {
  var file = "./app/views/" + location + ".ejs";

  fs.readFile(file, 'utf8', function(err, template) {
    if (err) {
      console.log(err);
    } else {
      var body = ejs.render(template, data);
      handler(body);
    }
  });
}

function renderError(code, response) {
  response.status(404);
  response.render('errors/' + code, { title: "Error " + code});
}

// var sendEmail;
// if (process.env.NODE_ENV == "development") {
//   sendEmail = function(options) {
//     console.log("    Email sent to: " + options.to + " (but not really)\n");
//   }
// } else {
//   sendEmail = function(options) {
//     sendgrid.send(options, function(err, json) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("    Email sent to: " + options.to + "\n");
//       }
//     });
//   }
// }

// function uploadFile(file, salt, handler) {
//   var url = dateformat(new Date(), "yyyy/mm/dd/") + salt + file.name;

//   var params = {
//     Bucket: process.env.AWS_BUCKET,
//     ContentType: file.type,
//     Key: url,
//     Body: file.data
//   };

//   s3.putObject(params, function(err, data) {
//     handler(url);
//   });
// }

// function signIn(user, request) {
//   console.log("  Signing in: " + user.email);
//   request.session.loggedInEmail = user.email;
// }
//
// function signOut(request) {
//   console.log("  Signing out: " + request.session.loggedInEmail);
//   request.session.loggedInEmail = undefined;
// }

function currentUser(request, handler) {
  var token = request.get("Authorization-Token");

  if (token) {
    new User({authorization_token: token}).fetch().then(function(user) {
      if (user) {
        handler(user);
      } else {
        handler(undefined);
      }
    });
  } else {
    handler(undefined);
  }
}

var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var target = "upenn.edu";

function emailValid(email) {
  return (re.test(email) && (email.substr(email.length - target.length) == target)) || (email == "mluzuriaga@friendscentral.org") || (email == "gschiller@friendscentral.org") || (email == "info@natotickets.com");
}

exports.renderPartial = renderPartial;
exports.renderError = renderError;
// exports.signIn = signIn;
// exports.signOut = signOut;
exports.currentUser = currentUser;
exports.emailValid = emailValid;