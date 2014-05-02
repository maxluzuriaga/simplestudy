function index(request, response) {
  // serve landing page if logged in, otherwise serve backbone app
}

function client(request, response) {
	response.render('pages/api-client');
}

exports.index = index;
exports.client = client;