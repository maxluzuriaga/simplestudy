var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
  	db.addColumn.bind(db, 'users', 'access_token', {
      type: 'string'
  	}),
    db.addColumn.bind(db, 'users', 'refresh_token', {
      type: 'string'
    })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.removeColumn.bind(db, 'users', 'access_token'),
    db.removeColumn.bind(db, 'users', 'refresh_token')
  ], callback);
};
