var program = require('commander')
var packageJson = require('./package.json')
var parseUrl = require('url').parse

var argv

module.exports = function() {

	if (!argv) {
		program.version(packageJson.version)
			.option('-v, --update-version [version]', 'which version should the update rest api reply with')
			.option('-f, --file [file]', 'which update file to serve')
			.option('-u, --update-url [updateUrl]', 'set the update url')
			.option('-r, --file-url [fileUrl]', 'set the file serving url')
			.parse(process.argv);

		if (!program.updateVersion) {
			throw new Error('missing --update-version')
		}

		if (!program.updateUrl) {
			throw new Error('missing --update-url')
		}

		if (!program.fileUrl) {
			throw new Error('missing --fileUrl')
		}

		if (!program.file) {
			throw new Error('missing --file')
		}

		program.updateUrl = parseUrl(program.updateUrl)
		program.fileUrl = parseUrl(program.fileUrl)

		argv = program
	}

	return argv
}
