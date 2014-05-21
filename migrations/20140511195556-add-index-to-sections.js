var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('sections', 'index', {
    type: 'int'
  }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('sections', 'index', callback);
};
