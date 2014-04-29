var db = require("./lib/db.js");
    // Post = require("./app/models/post"),
    // Category = require("./app/models/category");

desc('Create seed posts');
task('seed', {async: true}, function(username, password) {
  db.connect(function() {
    Category.findOne({ slug: 'misc' }, function(err, category) {
      var post = new Post({
        title: 'This is a fresh new test post',
        email: 'gschiller@friendscentral.org',
        confirmed: true,
        _category: category._id,
        text_markdown: 'Lorem ipsum dolor **sit amet**, consectetur adipisicing elit, sed do _eiusmod tempor incididunt_ ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      });

      post.save(function(err, post) {
        complete();
      });
    });
  });

  jake.addListener('complete', function () {
    process.exit();
  });
});

namespace('db', function() {
  desc('Migrate the database');
  task('migrate', function(env) {
    env = env || "dev"
    jake.exec(["./node_modules/.bin/db-migrate up --config config/database.json --env "+env], { printStdout: true});
  });

  desc('Migrate the database down');
  task('down', function(env) {
    env = env || "dev"
    jake.exec(["./node_modules/.bin/db-migrate down --config config/database.json --env "+env], { printStdout: true});
  });

  desc('Reset the database');
  task('reset', {async: true}, function() {
    db.reset(function() {
      console.log("Database cleared");
      complete();
    });

    jake.addListener('complete', function () {
      process.exit();
    });
  });
});

desc('Run the test suite');
task('test', function() {
  jake.exec(["./node_modules/.bin/mocha --reporter list"], { printStdout: true });
});