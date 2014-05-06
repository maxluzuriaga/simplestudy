var helper = require('../../lib/helper');

function update(request, response) {
  var currentID = request.user.id;
  var canUpdate = (currentID == request.section.id) || (currentID == request.section.related('guide').get('owner_id'));

  if (canUpdate) {
    request.section.set('text', request.body.text);

    request.section.save({text: request.body.text}, {patch: true}).then(function(section) {
      response.json(200, {successful: true});
    });
  } else {
    helper.renderError(404, response);
  }
}

function approve(request, response) {

}

exports.update = update;
exports.approve = approve;