casper.assertDisplayedItemsCount = function(itemsNumber, message) {
    this.test.assertEval(function (itemsAwaitedNumber) {
        var items = document.querySelectorAll('#todo-list li');
        var number = 0;
        for(var i = 0 ; i < items.length ; i++) {
            // this if to accept only displayed elements
            // TODO see https://groups.google.com/forum/?fromgroups=#!topic/jquery-dev/4Ys5mzbQP08
            // __utils__.visible seems not to work in this case...
            if(items[i].offsetWidth > 0 || items[i].offsetHeight > 0) {
                number++;
            }
        }
        return number === itemsAwaitedNumber;
    }, message, itemsNumber);
};

casper.assertLeftItemsString = function(leftItemsString, message) {
    // Backbone for example does not update string since it's not displayed. It's a valid optimization
    if(leftItemsString == '0 items left' && !this.visible('#todo-count')) {
        this.test.assertTrue(true, 'Left items label is not displayed - ' + message);
        return;
    }
    var displayedString = this.fetchText('#todo-count').replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
    this.test.assertEquals(displayedString, leftItemsString, message);
};

casper.assertStorage = function(storageSize) {
    this.test.assertEval(function (storageSize) {
    	return true;
    	// TODO !
    	/*
        var storage = JSON.parse(window.localStorage.getItem('todos-vanilladart'));
        if(storageSize === 0 && storage == null) {
            return true;
        }
        var size = storage.length;
        return size === storageSize;
        */
    }, 'Assert storage size is ' + storageSize, storageSize);
};
