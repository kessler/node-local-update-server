var argv = require('./argv')
var express = require('express')
var serveStatic = require('connect-static-file')
var hostile = require('hostile')

var DEFAULT_PORT = 80

module.exports.app = function(opts, callback) {

	if (opts.fileUrl.port === opts.updateUrl.port) {

		createApp()
			.get(opts.fileUrl.pathname, fileMiddleware(opts.file))
			.get(opts.updateUrl.pathname, versionMiddleware(opts.updateVersion))
			.listen(opts.fileUrl.port || DEFAULT_PORT, function(err) {
				if (err) return callback(err)

				callback()
			})

	} else {

		createApp()
		.get(opts.fileUrl.pathname, fileMiddleware(opts.file))
		.listen(opts.fileUrl.port || DEFAULT_PORT, function(err) {
			if (err) return callback(err)

			createApp()
			.get(opts.updateUrl.pathname, versionMiddleware(opts.updateVersion))
			.listen(opts.updateUrl.port || DEFAULT_PORT, function(err) {
				if (err) return callback(err)

				callback()
			})
		})

	}


	function createApp() {
		var app = express()

		return app
	}
}

module.exports.dnsTakeover = function(domains, callback) {
	domains.forEach(function(domain) {
		hostile.set('127.0.0.1', domain)
	})
}

module.exports.dnsRemove = function(domains, callback) {
	domains.forEach(function(domain) {
		hostile.remove('127.0.0.1', domain)
	})
}

function versionMiddleware(version) {

	return function(req, res, next) {
		res.set('content-type', 'text/plain')
		res.end(version)
	}
}

function fileMiddleware(file) {
	return serveStatic(file)
}
