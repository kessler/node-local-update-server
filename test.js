var expect = require('chai').expect
var path = require('path')
var index = require('./index')
var hostile = require('hostile')
var request = require('request')
var parseUrl = require('url').parse
var fs = require('fs')

describe('local-update-server', function() {

	describe('uses hostile to manage domains', function() {
		var domains

		it('take over', function() {
			index.dnsTakeover(domains)

			var hosts = hostile.get()


			expect(hosts.pop()).to.deep.eql(['127.0.0.1', domains[1]])
			expect(hosts.pop()).to.deep.eql(['127.0.0.1', domains[0]])

			hostile.remove('127.0.0.1', domains[0])
			hostile.remove('127.0.0.1', domains[1])
		})

		it('remove', function() {
			hostile.set('127.0.0.1', domains[0])
			hostile.set('127.0.0.1', domains[1])

			index.dnsRemove(domains)

			var hosts = hostile.get()

			expect(hosts.pop()).to.not.deep.eql(['127.0.0.1', domains[1]])
			expect(hosts.pop()).to.not.deep.eql(['127.0.0.1', domains[0]])
		})

		beforeEach(function() {
			domains = [Date.now() + 't.com', Date.now() + 't1.com']
		})

		afterEach(function() {
			hostile.remove('127.0.0.1', domains[0])
			hostile.remove('127.0.0.1', domains[1])
		})
	})

	describe('creates an http server to serve both file and update version endpoints', function() {
		var domains

		it('same port', function(done) {

			var updateUrl = 'http://asdfdasdfasdfa.com/version'
			var fileUrl = 'http://asdfdasdfasdfa.com/download'
			var file = path.resolve(__dirname, 'readme.md')

			testServer(fileUrl, updateUrl, file, done)
		})

		it('different ports', function(done) {

			var updateUrl = 'http://lkjasllksjsls.com:8080/version'
			var fileUrl = 'http://qwecqwdqdww.com:9090/download'
			var file = path.resolve(__dirname, 'readme.md')

			testServer(fileUrl, updateUrl, file, done)
		})

		afterEach(function () {
			if (domains && domains.length > 0) {
				index.dnsRemove(domains)
			}
		})

		function testServer(fileUrl, updateUrl, file, done) {
			var opts = {
				updateUrl: parseUrl(updateUrl),
				fileUrl: parseUrl(fileUrl),
				file: file,
				updateVersion: '0.0.1'
			}

			domains = [opts.fileUrl.hostname, opts.updateUrl.hostname]

			index.dnsTakeover(domains)

			index.app(opts, function(err) {
				if (err) return done(err)

				get(updateUrl, function (err, res, body) {
					if (err) return done(err)

					expect(body).to.eql('0.0.1')
					expect(res.headers).to.have.property('content-type', 'text/plain; charset=utf-8')

					get(fileUrl, function (err, res, body) {
						if (err) return done(err)

						expect(body).to.eql(fs.readFileSync(file, 'utf8'))

						done()
					})
				})
			})
		}
	})

	function get(url, callback) {
		request.get(url, function(err, res, body) {
			if (err) return callback(err)

			if (res.statusCode < 200 || res.statusCode > 299) {
				return callback(new Error('invalid status code ' + res.statusCode))
			}

			callback(null, res, body)
		})
	}
})
