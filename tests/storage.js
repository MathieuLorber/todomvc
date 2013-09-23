
// TODO http://stackoverflow.com/questions/13749213/clear-localstorage-with-casperjs

casper.start(URL, function () {
	this.cleanStorage();

	this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

	this.assertItemCount(0, 'No todo at start');

	this.assertLeftItemsString('0 items left', 'Left todo list count is 0');

	this.test.assertNotVisible('#main', '#main section is hidden');
	this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
	this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');
});

// Create 3 todos
casper.then(function () {
	this.assertItemCount(0, 'No todo at start');
	this.assertStorage(0);
	this.addTodo('Some Task');
	this.assertStorage(1);
	this.addTodo('Another Task');
	this.assertStorage(2);
	this.addTodo('A third Task');
	this.assertItemCount(3, 'We now have 3 todos');
	this.assertStorage(3);
});

casper.run(function () {
	this.test.renderResults(true);
	//this.test.renderResults(true);
});
