var helper = require('../../lib/helper');

function update(request, response) {
  request.section.load(['guide']).then(function(section) {
    var currentID = request.user.id;
    var canUpdate = (currentID == section.id) || (currentID == section.related('guide').get('owner_id'));

    if (canUpdate) {
      section.set('text', request.body.text);

      section.save({text: request.body.text}, {patch: true}).then(function(section) {
        response.json(200, {successful: true});
      });
    } else {
      helper.renderError(404, response);
    }
  });
  var canUpdate;
}

function approve(request, response) {

}

exports.update = update;
exports.approve = approve;