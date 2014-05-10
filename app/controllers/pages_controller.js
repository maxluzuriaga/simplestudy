function index(request, response) {
  response.render('pages/index');
}

function client(request, response) {
  response.render('pages/api-client');
}

exports.index = index;
exports.client = client;