#!/usr/bin/env node

var argv = require('./argv')()
var index = require('./index')

var domains = [argv.fileUrl.hostname, argv.updateUrl.hostname]

index.dnsTakeover(domains)

process.on('exit', function () {
	index.dnsRemove(domains)
})

index.app(argv, function (err) {
	if (err) return console.error(err)
	console.log('ready')
})
