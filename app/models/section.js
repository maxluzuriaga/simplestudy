var bookshelf = require('bookshelf').PG;

var Section = bookshelf.Model.extend({
  tableName: 'sections',
  idAttribute: 'id',

  guide: function() {
    return this.belongsTo(Guide);
  },
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Section;

var User = require('./user'),
    Guide = require('./guide');