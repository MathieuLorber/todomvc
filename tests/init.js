var casper = require('casper').create();
var URL = casper.cli.get('url');
var fmk = casper.cli.get('fmk');
var debug = casper.cli.get('fmk');
var output = casper.cli.get('output');

var captureIndex = 0;

casper.echo('Test ' + fmk + " - " + URL, 'PARAMETER');
// TODO param
casper.echo('Capture');

casper.addTodo = function(title) {
	// TODO about initial focus testing
	this.evaluate(function() {
		document.querySelector('#new-todo').focus();
	});
	this.page.sendEvent('keydown', title);
	// TODO remove one, but keep which event ? Jquery impl prefers keyup...
	this.page.sendEvent('keydown', this.page.event.key.Enter);
	this.page.sendEvent('keyup', this.page.event.key.Enter);
};

// TODO rename "displayed" items
casper.assertItemCount = function(itemsNumber, message) {
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
casper.unselectText = function(selector) {
	var textLength = this.getElementAttribute(selector, 'value').length;
	// without this if setSelectionRange breaks Vanilla JS & anothers test run
	if(textLength != 0) {
		this.evaluate(function(selector, textLength) {
			document.querySelector(selector).setSelectionRange(textLength, textLength);
		}, selector, textLength);
	}
}

// TODO find why most times useless
// TODO remove localstorage instead
casper.cleanStorage = function() {
	// make a localStorage.clear() is not enough because elements have already been created here
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
	this.evaluate(function() {
		document.querySelector('#toggle-all').click();
	});
	this.evaluate(function() {
		document.querySelector('#clear-completed').click();
	});
	// ne semble meme pas marcher (ne pas oublier pb d'"affichage")
	//this.evaluate(function() {
	//	localStorage.clear();
	//});
};

casper.doCapture = function() {
	this.capture('tests/results/' + fmk + '.' + captureIndex + '.png');
	captureIndex++;
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
