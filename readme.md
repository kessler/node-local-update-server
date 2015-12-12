# local-update-server

A tool that creates a local update server. Using this tool one defines a version and a download http endpoints, the tool then takes over the domains used (hosts file) and serves the content. Very useful for local testing and such

[![npm status](http://img.shields.io/npm/v/update-mock-server.svg?style=flat-square)](https://www.npmjs.org/package/update-mock-server) 

## CLI Tool

`npm install -g local-update-server`

```bash
local-update-server --update-url="http://blablabla.com/version" --update-version="1.2.3" --file="/some/path/to/file" --fileUrl="http://blablabla.com/download"
```

## API
`npm install --save local-update-server`

```javascript
var localUpdateServer = require('local-update-server')
var parseUrl = require('url').parse

var opts = {
    updateUrl: parseUrl('http://blabla.com:9090/version'),
    fileUrl: parseUrl('http://foobar.com/download'),
    file: '/path/to/file',
    updateVersion: '0.0.1'
}

var domains = [opts.fileUrl.hostname, opts.updateUrl.hostname]

index.dnsTakeover(domains)

process.on('exit', function () {
    index.dnsRemove(domains)
})

index.app(opts, function (err) {
    if (err) return console.error(err)
    console.log('ready')
})
```

## license

[MIT](http://opensource.org/licenses/MIT) © Yaniv Kessler
