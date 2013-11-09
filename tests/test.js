casper.start(URL, function () {
    this.doCapture();
    //this.cleanStorage();

    this.test.assertTitleMatch(/TodoMVC$/, 'Page title contains TodoMVC');

    this.assertItemCount(0, 'No todo at start');

    this.assertLeftItemsString('0 items left', 'Left todo list count is 0');

    this.test.assertNotVisible('#main', '#main section is hidden');
    this.test.assertNotVisible('#toggle-all', '#toggle-all checkbox is hidden');
    this.test.assertNotVisible('#todo-count', '#todo-count span is hidden');

    this.echo("\033[31mKO\033[0m| plop");
});

casper.run(function () {
    this.test.renderResults(true);
});
