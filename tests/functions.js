
if(typeof tests === "undefined") {
    var tests = ['edit', 'count', 'history', 'storage'];
}

// ENTER keypress
// TODO use if(typeof casper.enter === "undefined") { for those...
casper.enter = function() {
    // TODO remove one, but keep which event ? Jquery impl prefers keyup...
    this.page.sendEvent('keydown', this.page.event.key.Enter);
    this.page.sendEvent('keyup', this.page.event.key.Enter);
};

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
    if(textLength != 0) {
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
    if(debug) {
        // TODO echo
        this.capture('tests/results/' + fmk + '.' + captureIndex + '.png');
        captureIndex++;
    }
};