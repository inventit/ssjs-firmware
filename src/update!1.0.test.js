var nodeUnit = require('nodeunit');
var sinon = require('sinon');
var script = require('path').resolve('./update!1.0.js');
var moat = require('moat');

module.exports = nodeUnit.testCase({
  setUp: function(callback) {
	require.cache[script] = null;
	callback();
  },
  tearDown: function(callback) {
  	callback();
  },
  'firmware update, successful case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var arguments = {
        fw: {
            uid: "uid-for-firmware-binary"
        }
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', arguments, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');
	var database = context.database;
	var binary = {
		name: 'my-firmware',
		version: '1.0',
		object: {
			get: 'http://localhost/my-firmware-1.0.zip',
			type: 'my-type'
		}
	};
	database.querySharedByUids.withArgs(
		'Binary', ['uid-for-firmware-binary'],
		['name','version','object'], ['get']).returns([binary]);

    var session = context.session;
    var downloadInfoMapper = session.newModelMapperStub('DownloadInfo');
	var downloadInfo = downloadInfoMapper.newModelStub();
	context.addCommand(downloadInfo, 'downloadAndUpdate',
		context.newSuccessfulCommandEvent(true, null));

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(true, session.commit.called);
    assert.equal(true, session.setWaitingForResultNotification.withArgs(true).called);
    assert.equal('uid-for-firmware-binary', downloadInfo.uid);
    assert.equal('http://localhost/my-firmware-1.0.zip', downloadInfo.url);
	assert.equal(true, downloadInfoMapper.update.withArgs(downloadInfo).called);
	assert.equal(false, session.notifyAsync.called);
    assert.done();
  },

  'firmware update, error case.' : function(assert) {
	// record state
    var context = moat.init(sinon);
    var arguments = {
        fw: {
            uid: "uid-for-firmware-binary"
        }
    };
    context.setDevice('uid', 'deviceId', 'name', 'status', 'clientVersion', 0);
    context.setDmjob('uid', 'deviceId', 'name', 'status', 'jobServiceId',
			'sessionId', arguments, 'createdAt', 'activatedAt', 'startedAt',
			'expiredAt', 'http', 'http://localhost');
	var database = context.database;
	var binary = {
		name: 'my-firmware',
		version: '1.0',
		object: {
			get: 'http://localhost/my-firmware-1.0.zip',
			type: 'my-type'
		}
	};
	database.querySharedByUids.withArgs(
		'Binary', ['uid-for-firmware-binary'],
		['name','version','object'], ['get']).returns([binary]);

    var session = context.session;
    var downloadInfoMapper = session.newModelMapperStub('DownloadInfo');
	var downloadInfo = downloadInfoMapper.newModelStub();
	context.addCommand(downloadInfo, 'downloadAndUpdate',
		context.newErrorCommandEvent('fatal_error', '12345'));

    // Run the script (replay state)
    require(script);

    // Assertion
    assert.equal(true, session.commit.called);
    assert.equal(false, session.setWaitingForResultNotification.withArgs(true).called);
    assert.equal('uid-for-firmware-binary', downloadInfo.uid);
    assert.equal('http://localhost/my-firmware-1.0.zip', downloadInfo.url);
	assert.equal(true, downloadInfoMapper.update.withArgs(downloadInfo).called);
	assert.equal(true, session.notifyAsync.called);
    assert.done();
  }
});
