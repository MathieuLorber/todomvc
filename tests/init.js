var casper = require('casper').create();
var url = casper.cli.get('url');
var fmk = casper.cli.get('fmk');
var debug = (casper.cli.get('debug') == true);

var fs = require('fs');

var captureIndex = 0;

var testTitle = 'Test ' + fmk + " - " + url;
if(debug) {
    testTitle += ' - DEBUG';
}
casper.echo(testTitle, 'PARAMETER');
