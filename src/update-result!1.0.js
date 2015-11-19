/*
 * JobServiceID:
 * urn:moat:${APPID}:firmware:update-result:1.0
 *
 * Description: Firmware Update Function.
 * Reference: https://docs.google.com/a/yourinventit.com/document/d/1kdHxMp2VcZWcDnJ4YZqmW_aEYQt94ySrlityZQK2g6w/edit#heading=h.ql5gc3idrq72
 */
var moat = require('moat');
var context = moat.init();
var session = context.session;
var clientRequest = context.clientRequest;

session.log('update-result', 'Start Firmware Update Result!');

// DownloadInfo should be returned
var objects = clientRequest.objects;
if (objects.length === 0) {
	session.log('Device sends wrong information.');
	throw "No DownloadInfo object!";
}
var result = objects[0];
if (result.status != 'UPDATED') {
	// error!
	session.log('update-result', 'Failed to firmware update:' + result.name + ', status:' + result.status + ', errorInfo:' + result.errorInfo);
} else {
	session.log('update-result', 'OK! : ' + result.name);
}
session.notifyAsync(result);
