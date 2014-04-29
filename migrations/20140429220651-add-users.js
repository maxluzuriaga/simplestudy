var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    email: 'string',
    fullName: 'string',
    authorizationToken: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
