var bookshelf = require('bookshelf').PG;

var User = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'id',

  guides: function() {
    return this.hasMany(Guide, 'owner_id');
  },
  sections: function() {
    return this.hasMany(Section);
  },

  renderJSON: function() {
  	return this.omit(['authorization_token', 'identifier', 'google_id', 'domain', 'access_token', 'refresh_token']);
  }
});

module.exports = User;

var Guide = require('./guide'),
    Section = require('./section');