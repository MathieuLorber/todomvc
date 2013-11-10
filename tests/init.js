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

if(typeof casper.enter !== 'function') {
    casper.enter = function() {
        // TODO remove one, but keep which event ? Jquery impl prefers keyup...
        this.page.sendEvent('keydown', this.page.event.key.Enter);
        this.page.sendEvent('keyup', this.page.event.key.Enter);
    }
}

casper.addTodo = function(title) {
    this.evaluate(function() {
        document.querySelector('#new-todo').focus();
    });
    this.page.sendEvent('keydown', title);
    this.enter();
};

casper.assertDisplayedItemsCount = function(itemsNumber, message) {
	this.doCapture();
	this.test.assertEval(function (itemsAwaitedNumber) {
		var items = document.querySelectorAll('#todo-list li');
		var number = 0;
		for(var i = 0 ; i < items.length ; i++) {
			// how to accept only displayed elements ?
			// => https://groups.google.com/forum/?fromgroups=#!topic/jquery-dev/4Ys5mzbQP08
			// __utils__.visible seems not to work in this case...
			if(items[i].offsetWidth > 0 || items[i].offsetHeight > 0) {
				number++;
			}
		}
		//__utils__.echo(number);
		return number === itemsAwaitedNumber;
	}, message, itemsNumber);
}

casper.assertLeftItemsString = function(leftItemsString, message) {
    this.doCapture();
	// Backbone for example does not update string since it's not displayed. It's a valid optimization
	if(leftItemsString == '0 items left' && !this.visible('#todo-count')) {
		this.test.assertTrue(true, 'Left items label is not displayed - ' + message);
		return;
	}
	var displayedString = this.fetchText('#todo-count').replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
	this.test.assertEquals(displayedString, leftItemsString, message);
};

// Implementations differ but text in input should not be selected when editing
// => this function should not have to be called
// TODO
casper.unselectText = function(selector) {
	var textLength = this.getElementAttribute(selector, 'value').length;
	// without this if setSelectionRange breaks Vanilla JS & anothers test run
	if(textLength != 0) {
		this.evaluate(function(selector, textLength) {
			document.querySelector(selector).setSelectionRange(textLength, textLength);
		}, selector, textLength);
	}
}

casper.cleanStorage = function() {
    // cleaning the storage with localStorage.clear() is not relevant : DOM is already built from its initial value
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
};

casper.doCapture = function() {
    if(debug) {
        this.capture('tests/results/' + fmk + '.' + captureIndex + '.png');
        captureIndex++;
    }
};

casper.assertStorage = function(storageSize) {
	this.test.assertEval(function (storageSize) {
		var storage = JSON.parse(window.localStorage.getItem('todos-vanilladart'));
		if(storageSize === 0 && storage == null) {
			return true;
		}
		var size = storage.length;
		return size === storageSize;
	}, 'Assert storage size is ' + storageSize, storageSize);
};
