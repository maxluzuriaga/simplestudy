var bookshelf = require('bookshelf').PG;

var User = require('./user'),
    Section = require('./section');

var Guide = bookshelf.Model.extend({
  tableName: 'guides',
  idAttribute: 'id',

  owner: function() {
    return this.belongsTo(User, 'owner_id');
  },
  users: function() {
    return this.hasMany(User).through(Section);
  },
  sections: function() {
    return this.hasMany(Section);
  }
});

module.exports = Guide;