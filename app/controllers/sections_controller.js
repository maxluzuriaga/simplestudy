var helper = require('../../lib/helper');

function update(request, response) {
  var currentID = request.user.id;
  var canUpdate = (currentID == request.section.related('user').id) || (currentID == request.section.related('guide').get('owner_id'));

  if (canUpdate) {
    request.section.save({text: request.body.body, edited_date: new Date()}, {patch: true}).then(function(section) {
      response.json(200, {successful: true});
    });
  } else {
    helper.renderError(403, response);
  }
}

function approve(request, response) {
  var canApprove = (request.user.id == request.section.related('guide').get('owner_id'));

  if (canApprove) {
    request.section.save({approved: true}, {patch: true}).then(function(section) {
      response.json(200, {successful: true});
    });
  } else {
    helper.renderError(403, response);
  }
}

function disapprove(request, response) {
  var canApprove = (request.user.id == request.section.related('guide').get('owner_id'));

  if (canApprove) {
    request.section.save({approved: false}, {patch: true}).then(function(section) {
      response.json(200, {successful: true});
    });
  } else {
    helper.renderError(403, response);
  }
}

exports.update = update;
exports.approve = approve;
exports.disapprove = disapprove;