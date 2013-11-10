if (typeof tests === "undefined") {
    var tests = ['edit', 'count', 'history', 'storage'];
}

if (typeof storageName === "undefined") {
	// TODO doc default name
	var storageName = function() {
        // TODO ? will fail but not a problem ?
        return 'todos-' + fmk;
    };
}

//  TODO rename pressEnter, not in casper anymore, global fct
// ENTER keypress
casper.enter = function() {
    // TODO remove one, but keep which event ? Jquery impl prefers keyup...
    this.page.sendEvent('keydown', this.page.event.key.Enter);
    this.page.sendEvent('keyup', this.page.event.key.Enter);
};

if (typeof getStorageSize === "undefined") {
	var getStorageSize = function(storageName) {
		var storage = JSON.parse(window.localStorage.getItem(storageName));
		if (!storage) {
			return 0;
		}
		return storage.length;
	};
}

casper.addTodo = function(title) {
    this.evaluate(function() {
        document.querySelector('#new-todo').focus();
    });
    this.page.sendEvent('keydown', title);
    this.enter();
};

// Implementations differ but text in input should not be selected when editing
// => this function should not have to be called
// TODO
casper.unselectText = function(selector) {
    var textLength = this.getElementAttribute(selector, 'value').length;
    // without this if setSelectionRange breaks Vanilla JS & anothers test run
    if (textLength != 0) {
        this.evaluate(function(selector, textLength) {
            document.querySelector(selector).setSelectionRange(textLength, textLength);
        }, selector, textLength);
    }
};

casper.cleanStorage = function() {
    // cleaning the storage with localStorage.clear() is not relevant : DOM is already built from its initial value
    this.evaluate(function() {
        document.querySelector('#clear-completed').click();
        document.querySelector('#toggle-all').click();
        document.querySelector('#clear-completed').click();
    });
};

casper.doCapture = function() {
    if (debug) {
        // TODO echo
        this.capture('tests/results/' + fmk + '.' + captureIndex + '.png');
        captureIndex++;
    }
};
