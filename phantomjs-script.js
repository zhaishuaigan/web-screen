var page          = require('webpage').create();
var system        = require('system');
var url           = system.args[1];
var filename      = system.args[2];
page.viewportSize = {
    width : system.args[3] ? system.args[3] : 1024,
    height: system.args[4] ? system.args[4] : 600
};
page.open(url, function () {
    page.render(filename);
    phantom.exit();
});