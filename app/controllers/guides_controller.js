var User = require('../models/user')
    Guide = require('../models/guide'),
    Section = require('../models/section');

function myGuides(request, response) {
  // all guides owned by logged-in user
  request.user.load(['guides']).then(function(user) {
    var guides = user.related('guides').models.map(function(guide) {
      return guide.omit('owner_id');
    });

    response.json(200, guides);
  });
}

function sharedGuides(request, response) {
  // all guides shared with logged-in user
  request.user.load(['sections', 'sections.guide', 'sections.guide.owner']).then(function(user) {
    var sections = user.related('sections');
    var sharedGuides = sections.models.map(function(section) {
      var obj = section.related('guide').omit('owner_id');

      obj.owner = section.related('guide').related('owner').renderJSON();
      obj.sectionApproved = section.get('approved');

      return obj;
    });

    response.json(200, sharedGuides);
  });
}

function show(request, response) {
  // show details of / sections of guide if user has access to it
  // don't include section texts unless user is owner or has approved section in guide
  request.guide.load(['owner', 'sections', 'sections.user']).then(function(guide) {
    if (guide.related('owner').id == request.user.id) {
      response.json(200, request.guide.renderJSON({includeSectionText: true}));
    } else {
      var allowedToView = false;
      var includeText = false;

      guide.related('sections').models.forEach(function(section) {
        if (section.get('user_id') == request.user.id) {
          allowedToView = true;

          if (section.get('approved') == true) {
            includeText = true;
          }
        }
      });

      if (allowedToView) {
        response.json(200, request.guide.renderJSON({includeSectionText: includeText, userID: request.user.id}));
      }
    }
  });
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
          response.json(200, {id: guide.id});
        } else {
          response.json(400, {});
        }
      });
    } else {
      response.json(400, {});
    }
  });
}

exports.myGuides = myGuides;
exports.sharedGuides = sharedGuides;
exports.show = show;
exports.create = create;