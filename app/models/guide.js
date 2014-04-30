var bookshelf = require('bookshelf').PG;

var User = require('./user'),
    Section = require('./section');

var Guide = bookshelf.Model.extend({
  tableName: 'guides',
  idAttribute: 'id',

  owner: function() {
    return this.belongsTo(User, 'owner_id');
  },
  sections: function() {
    return this.hasMany(Section);
  }
});

module.exports = Guide;