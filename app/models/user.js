var bookshelf = require('bookshelf').PG;

var Guide = require('./guide'),
    Section = require('./section');

var User = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'id',

  guides: function() {
    return this.hasMany(Guide, 'owner_id');
  },
  sections: function() {
    return this.hasMany(Section);
  }
});

module.exports = User;