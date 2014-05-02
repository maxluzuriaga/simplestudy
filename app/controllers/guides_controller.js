var User = require('../models/user')
    Guide = require('../models/guide'),
    Section = require('../models/section');

function index(request, response) {
  // all guides associated with logged-in user
  response.json(200, request.user.toJSON());
}

function show(request, response) {
  // show details of / sections of guide if user has access to it
  // don't include section texts unless user is owner or has approved section in guide
}

function _createSections(arr, index, guideid, callback) {
  if (index >= arr.length) {
    callback(true);
    return;
  }

  var info = arr[index];
  new User({email:info.email}).fetch().then(function(user) {
    if (user) {
      var section = new Section({
        user_id: user.id,
        guide_id: guideid,
        name: info.name,
        edited_date: new Date()
      });

      section.save().then(function(section) {
        if (section) {
          _createSections(arr, index+1, guideid, callback);
        } else {
          callback(false);
          // throw some kind of error
        }
      });
    } else {
      callback(false);
      // throw some kind of error
    }
  });
}

function create(request, response) {
  var guide = new Guide({
    name: request.body.name,
    owner_id: request.user.id,
    created_date: new Date()
  });

  guide.save().then(function(guide) {
    if (guide) {
      var sectioninfo = JSON.parse(request.body.sections);
      _createSections(sectioninfo, 0, guide.id, function(success) {
        if (success) {
          guide.load(['owner', 'sections']).then(function(guide) {
            response.json(200, guide.toJSON());
          });
        } else {

        }
      });
    } else {

    }
  });
}

exports.index = index;
exports.show = show;
exports.create = create;