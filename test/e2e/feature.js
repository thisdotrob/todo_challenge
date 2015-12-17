var utils = require('./../utils');
var ToDo = require('mongoose').model('ToDo');

describe('ToDo app', function() {

  describe('No ToDo\'s in the database', function() {

    beforeEach(function (done) {utils.clearDB(done)});
    afterEach(function (done) {utils.disconnectDB(done)});

    it('has the correct title', function() {
      browser.get('http://localhost:8080');
      expect(browser.getTitle()).toEqual('ToDo');
    });

    it('can add a task', function(done) {
      browser.get('http://localhost:8080');
      var expected = 'I need to do this';
      element(by.model('ctrl.draftToDo')).sendKeys(expected);
      element(by.id('submit-btn')).click();
      element(by.css('.task')).getText().then(function(text) {
        expect(text).toEqual(expected);
        done();
      });
    });
  });

  describe('Pre-existing ToDo\'s in the database', function() {

    beforeEach(function (done) {
      utils.clearDB(function() {
        utils.seedDB(done);
      });
    });

    afterEach(function (done) {
      utils.disconnectDB(done);
    });

    it('loads pre-entered tasks on page load', function(done) {
      browser.get('http://localhost:8080');
      var elements = element.all(by.repeater('toDo in ctrl.toDos'));
      elements.count().then(function(count) {
        var resultsPushed = 0;
        var result = [];
        for(var i = 0; i < count; i++) {
          elements.get(i).element(by.css('.task')).getText().then(pushResult);
        }
        function pushResult(text) {
          result.push(text);
          resultsPushed ++;
          if(resultsPushed === count) {
            expect(result).toEqual(['Task 0', 'Task 1', 'Task 2']);
            done();
          }
        }
      });
    });

    it('can delete a task', function(done) {
      browser.get('http://localhost:8080');
      var elements = element.all(by.repeater('toDo in ctrl.toDos'));
      elements.first().element(by.css('.delete-btn')).click().then(function() {
        elements.count().then(function(count) {
          expect(count).toEqual(2);
          done();
        })
      });
    });

  });

});
