var app = app || {};

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	options.url = '/api' + options.url;
	if (!options.beforeSend) {
		options.beforeSend = function(xhr) {
			xhr.setRequestHeader('Authorization-Token', "d5a28d2574895978ef2c1bcff9cdff9963cebdba");
			xhr.setRequestHeader('X-CSRF-Token', $("meta[name=csrf-token").attr("content"));
		}
	}
});

_.templateSettings = {
	evaluate:    /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g,
};

$(function() {

});