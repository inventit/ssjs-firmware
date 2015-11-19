var nodeUnit = require('nodeunit');
var sinon = require('sinon');
var script = require('path').resolve('./src/update-result!1.0.js');
var moat = require('moat');

module.exports = nodeUnit.testCase({
  setUp: function(callback) {
	require.cache[script] = null;
	callback();
  },
  tearDown: function(callback) {
  	callback();
  },
  'firmware update result, successful case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var args = {
        fw: JSON.stringify({
            uid: "uid-for-firmware-binary"
        })
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', args, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');
	// see https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.qznmwoavtwsw
	context.setObjects([{
		uid: '111111111111111',
		name: 'my-firmware',
		version: '1.0',
		status: 'UPDATED'
	}]);
    var session = context.session;

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(false, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
	assert.equal(true, session.notifyAsync.calledOnce);
    assert.done();
  },

  'firmware update, error case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var args = {
        fw: JSON.stringify({
            uid: "uid-for-firmware-binary"
        })
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', args, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');
	// see https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.qznmwoavtwsw
	var resultDownloadInfo = {
		uid: 'uid-for-firmware-binary',
		name: 'my-firmware',
		version: '1.0',
		status: 'ERROR',
		errorInfo: 'some error'
	};
	context.setObjects([resultDownloadInfo]);
    var session = context.session;

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(false, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
	assert.equal(true, session.notifyAsync.withArgs(resultDownloadInfo).calledOnce);
    assert.done();
  }
});
