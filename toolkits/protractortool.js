/**
 * protractor toolkits
 */
var fs = require('fs');

/**
 * private function
 */
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

module.exports.screenshot = function(browser, path) {
    browser.takeScreenshot().then(function (png) {
        writeScreenShot(png, path);
});
}