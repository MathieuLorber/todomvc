casper.start(url, function () {
    // TODO test initial focus
    this.doCapture();

    // TODO find why most times useless
    this.cleanStorage();
});

// TODO write about time for hiding etc    
casper.then(function () {
    // TODO check we are in the good place ?
    this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

    // TODO assert history "all" has class selected
    // TODO test <a> style pour history s?
    // TODO test http://casperjs.org/api.html#casper.back
    // TODO echo step 1
    this.assertDisplayedItemsCount(0, 'No todo at start');
    this.assertLeftItemsString('0 items left', 'Left todo list count is 0');
    this.test.assertNotVisible('#main', '#main section is hidden');
    this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
    this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
    this.assertStorage(0);
    this.doCapture();
});

// Create a first todo
casper.then(function () {
    this.addTodo('Say hello !');

    this.assertDisplayedItemsCount(1, 'One todo has been added, list contains 1 item');

    this.assertLeftItemsString('1 item left', 'Left todo list count is 1');

    this.test.assertEquals(this.fetchText('#todo-list li:first-child label'), 'Say hello !', 'First todo is "Some Task"');
    //this.test.assertFirstTask('SomeTask');
    this.test.assertVisible('#main', '#main section is displayed');
    this.test.assertVisible('#toggle-all', '#toggle-all checkbox is displayed');
    this.test.assertVisible('#todo-count', '#todo-count span is displayed');
    this.assertStorage(1);
});

// Create a second todo
casper.then(function () {
    // let's test trim() => TODO in edit instead
    this.addTodo(' Make some tests ');

    this.assertDisplayedItemsCount(2, 'A second todo has been added, list contains 2 items');

    this.assertLeftItemsString('2 items left', 'Left todo list count is 2');

    this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Make some tests', 'Second todo is "Some Another Task"');
    this.assertStorage(2);
});

// Create a third todo
casper.then(function () {
    this.addTodo('Conquer the world');

    this.assertLeftItemsString('3 items left', 'One todo has been added, left todo list count is 3');

    this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden');
});

// Edit the second todo
casper.then(function () {
	// TODO do steps ! - autocount, method step
	this.echo('STEP X : edit the second todo', 'PARAMETER');
	this.test.assertNotVisible('#todo-list li:nth-child(2) .edit');

	this.mouseEvent('dblclick', '#todo-list li:nth-child(2) label');
	this.unselectText('#todo-list li:nth-child(2) .edit');

	this.test.assertNotVisible('#todo-list li:nth-child(2) label');
	this.test.assertVisible('#todo-list li:nth-child(2) .edit');
	
	// last space is to test triming
	this.page.sendEvent('keypress', ', some relevant ones ');
	//this.page.sendEvent('keypress', this.page.event.key.Enter);
	this.enter();

	this.test.assertVisible('#todo-list li:nth-child(2) label');
	this.test.assertNotVisible('#todo-list li:nth-child(2) .edit');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Make some tests, some relevant ones', 'Task title has been changed');
});

// Edit the third todo and save by onblur
casper.then(function() {
	this.test.assertVisible('#todo-list li:nth-child(3) label');

	this.mouseEvent('dblclick', '#todo-list li:nth-child(3) label');
	this.unselectText('#todo-list li:nth-child(3) .edit');

	this.page.sendEvent('keypress', ' and the neighborhood');

	this.evaluate(function() {
		document.querySelector('#todo-list li:nth-child(3) .edit').blur();
	});

	this.test.assertVisible('#todo-list li:nth-child(3) label');
	this.test.assertNotVisible('#todo-list li:nth-child(3) .edit');

	this.test.assertEquals(this.fetchText('#todo-list li:nth-child(3) label'), 'Conquer the world and the neighborhood', 'Task title has been changed');
});

// Complete the second todo
casper.then(function () {
    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    this.assertLeftItemsString('2 items left', 'Todo #2 has been completed, left todo list count is 2');

    // TODO check button string
    this.test.assertVisible('#clear-completed', '#clear-completed button is displayed');

    this.assertDisplayedItemsCount(3, 'List still contains 3 items');
    this.assertStorage(3);
});

// Remove completed todo
casper.then(function () {
    this.click('#clear-completed');

    this.assertLeftItemsString('2 items left', 'Todo #2 has been removed, left todo list count is still 2');

    this.test.assertEquals(this.fetchText('#todo-list li:nth-child(2) label'), 'Conquer the world and the neighborhood', 'Second left todo is previous third one');

    this.test.assertNotVisible('#clear-completed', '#clear-completed button is hidden once again');

    this.assertDisplayedItemsCount(2, 'List contains 2 items');
    this.assertStorage(2);
});

// Complete all todos
casper.then(function () {
    this.click('#toggle-all');

    this.assertLeftItemsString('0 items left', 'All todos completed, left list count is 0');
});

// Undo one completed todo and re-complete all todos
casper.then(function () {
    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    this.assertLeftItemsString('1 item left', 'Todo #2 un-completed, left list count is 1');

    this.click('#toggle-all');

    this.assertLeftItemsString('0 items left', 'All todos completed, left list count is 0');
});

// Undo all completed todo
casper.then(function () {
    this.click('#toggle-all');

    this.assertLeftItemsString('2 items left', 'All todos un-completed, left list count is 2');
});

// Complete all one by one and check toggle-all button uncomplete them all
casper.then(function () {
    this.click('#todo-list li:nth-child(1) input[type=checkbox]');
    this.click('#todo-list li:nth-child(2) input[type=checkbox]');

    // TODO checkbox should be checked
    this.assertLeftItemsString('0 items left', 'All todos completed one by one, left list count is 0');

    this.click('#toggle-all');

    this.assertLeftItemsString('2 items left', 'All todos un-completed, left list cound is 2');
});

casper.then(function () {
    // TODO essayer faire apres le renderResults
    this.evaluate(function() {
        window.localStorage.clear();
    });
});

casper.run(function () {
    this.test.renderResults(true);
});
