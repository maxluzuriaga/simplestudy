var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
  	db.addColumn.bind(db, 'users', 'image_url', {
      type: 'string'
  	}),
    db.addColumn.bind(db, 'users', 'google_id', {
      type: 'string'
    }),
    db.addColumn.bind(db, 'users', 'domain', {
      type: 'string'
    })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.removeColumn.bind(db, 'users', 'image_url'),
    db.removeColumn.bind(db, 'users', 'google_id'),
    db.removeColumn.bind(db, 'users', 'domain')
  ], callback);
};
