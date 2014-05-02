var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('sections', 'name', {
    type: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('sections', 'name', callback);
};
