var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('sections', {
    id: {
      type: 'serial',
      primaryKey: true
    },
    text: 'string',
    approved: 'boolean',
    editedDate: 'timestamptz',
    guide_id: 'int',
    user_id: 'int'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('sections', callback);
};
