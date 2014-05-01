function index(request, response) {
  // all guides associated with logged-in user
}

function show(request, response) {
  // show details of / sections of guide if user has access to it
  // don't include section texts unless user is owner or has approved section in guide
}

function create(request, response) {
  // create a guide, return json success or failure with id of guide
}

exports.index = index;
exports.show = show;
exports.create = create;