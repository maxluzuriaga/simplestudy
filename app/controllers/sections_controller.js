var helper = require('../../lib/helper');

function update(request, response) {
  var currentID = request.user.id;
  var canUpdate = (currentID == request.section.id) || (currentID == request.section.related('guide').get('owner_id'));

  if (canUpdate) {
    request.section.save({text: request.body.text, edited_date: new Date()}, {patch: true}).then(function(section) {
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

exports.update = update;
exports.approve = approve;