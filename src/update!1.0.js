/*
 * JobServiceID:
 * urn:moat:${APPID}:firmware:update:1.0
 *
 * Description: Firmware Update Function.
 * Reference: https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.ql5gc3idrq72
 */
var moat = require('moat');
var context = moat.init();
var session = context.session;
var database = context.database;
var clientRequest = context.clientRequest;

session.log('update', 'Start Firmware Update!');

// Get dmjob arguments.
var args = clientRequest.dmjob.arguments;
session.log('update', 'args => ' + JSON.stringify(args));

var fw = args.fw;
if (!fw) {
	var message = "Argument 'fw' is missing!";
	session.log('update', message);
	throw message;
}
var uid = fw.uid;
var firmwareArray = database.querySharedByUids(
	'Binary', [uid],
	['name','version','object'], ['get']);
if (firmwareArray.length === 0) {
	// The firmware is missing! Error!!!
	var message = "Firmware with uid:" + uid + " is missing!";
	session.log('update', message);
	throw message;
}
var firmware = firmwareArray[0];

var downloadInfoMapper = session.newModelMapperStub('DownloadInfo');
var downloadInfo = downloadInfoMapper.newModelStub();
downloadInfo.url = firmware.object.get;
downloadInfo.uid = uid;
downloadInfo.name = firmware.name;
downloadInfo.version = firmware.version;
downloadInfoMapper.update(downloadInfo);
downloadInfo.downloadAndUpdate(session, null, {
	success: function(result) {
		// always assume async to receive the updateation result
		session.setWaitingForResultNotification(true);
		session.log('update', 'success!');
	},
	error: function(type, code) {
		session.log('update', 'error: type:' + type + ', code:' + code);
		downloadInfo.status = 'ERROR';
		downloadInfo.errorInfo = {
			type: type,
			code: code
		};
		session.notifyAsync(downloadInfo);
	}
}); // including commit()
