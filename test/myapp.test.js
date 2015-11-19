var nodeUnit = require('nodeunit'),
    sinon = require('sinon'),
    script = require('path').resolve('./src/myapp.js'),
    moat = require('moat');

module.exports = nodeUnit.testCase({

  setUp: function(callback) {
    require.cache[script] = null;
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },

  'Your first unit test' : function(assert) {
    var context = moat.init(sinon),
        session = context.session;

    // Setup the dummy data
    var objs = [{firstname: 'John', lastname: 'Doe'}];
    context.setObjects(objs);

    session.fetchUrlSync.returns({responseCode: 200});

    var url = 'http://localhost',
        req = {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify(objs)
        };

    // Run the test target script
    assert.doesNotThrow(function() {
      require(script);
    });

    // Check assertions
    assert.ok(session.fetchUrlSync.calledOnce);
    assert.ok(session.fetchUrlSync.withArgs(url, req).calledOnce);
    assert.deepEqual({responseCode: 200}, session.fetchUrlSync(url, req));

    assert.done();
  }

});
