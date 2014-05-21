var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.removeColumn('users', 'identifier', callback);
};

exports.down = function(db, callback) {
  db.addColumn('users', 'identifier', {
    type: 'string'
  }, callback);
};
