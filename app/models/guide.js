var bookshelf = require('bookshelf').PG;

var Guide = bookshelf.Model.extend({
  tableName: 'guides',
  idAttribute: 'id',

  owner: function() {
    return this.belongsTo(User, 'owner_id');
  },
  sections: function() {
    return this.hasMany(Section);
  },

  renderJSON: function(options) {
    var obj = this.omit('owner_id');

    obj.mine = options.isOwner;
    obj.owner = this.related('owner').omit(['id', 'authorization_token', 'identifier']);

    var omitIncludeText = ['guide_id', 'user_id'];
    var omitNoText = ['guide_id', 'user_id', 'text'];

    var sections = this.related('sections');

    sections.comparator = function(section) {
      return section.get('index');
    };

    sections.sort();

    obj.sections = sections.models.map(function(section) {
      var omit;

      if (options.includeSectionText || options.userID == section.get('user_id')) {
        omit = omitIncludeText;
      } else {
        omit = omitNoText;
      }

      var obj = section.omit(omit);
      obj.user = section.related('user').renderJSON();

      if (options.userID == section.get('user_id')) {
        obj.mine = true;
      } else {
        obj.mine = false;
      }

      return obj
    });

    return obj;
  }
});

module.exports = Guide;

var User = require('./user'),
    Section = require('./section');