var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('guides', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    name: 'string',
    created_date: 'timestamptz',
    owner_id: 'int'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('guides', callback);
};
