var app = app || {};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	if (!options.ignorePrefilter) {
		options.url = '/api' + options.url;
		if (!options.beforeSend) {
			options.beforeSend = function(xhr) {
				xhr.setRequestHeader('Authorization-Token', $.cookie('authorization_token'));
				xhr.setRequestHeader('X-CSRF-Token', $("meta[name=csrf-token]").attr("content"));
			}
		}
	}
});

var cachedFiles = {};
app.getTemplate = function(file, handler) {
	if (cachedFiles[file]) {
		handler(cachedFiles[file]);
	} else {
		$.ajax({
			url: "/js/templates/" + file + ".html",
			method: "GET",
			ignorePrefilter: true,
		}).done(function(data) {
			cachedFiles[file] = data;
			handler(data);
		});
	}
}

app.asyncForEach = function(array, each, callback) {
	var completed = 0;

	var done = function() {
		completed ++;
		callbackIfDone();
	};

	var callbackIfDone = function() {
		if (completed == array.length) {
			callback();
		}
	};

	for (var i=0; i<array.length; i++) {
		each(array[i], done);
	}
}

Backbone.View.prototype.close = function() {
	if (this.beforeClose) {
		this.beforeClose();
	}

	this.remove();
	this.unbind();
}

$(function() {

});