var http = require('http');
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var crypto = require('crypto');

var PORT = 8000;

var server = http.createServer(function (request, response) {
    var filename = '';
    if (request.url.substr(0, 12) == '/screen?url=') {
        var params = {
            url: request.url.substr(12),
            filename: '',
            width: 1024,
            height: 600
        };
        var sizeReg = /\&size\=(\d+)\*(\d+)/;
        var sizeMatch = params.url.match(sizeReg);
        if (sizeMatch) {
            params.width = sizeMatch[1];
            params.height = sizeMatch[2];
            params.url = params.url.replace(sizeReg, '');
        }

        var cacheReg = /\&cache\=false/;
        var cacheMatch = params.url.match(cacheReg);
        if (cacheMatch) {
            params.url = params.url.replace(cacheReg, '');
        }

        var hash = crypto.createHash('md5').update(JSON.stringify(params)).digest('hex');
        params.filename = __dirname + '/cache/' + hash + '.png';

        fs.exists(params.filename, function (exists) {
            if (!exists || cacheMatch) {
                screen(params, function () {
                    sendFile(response, params.filename);
                }, function (err) {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    console.log('截屏失败:');
                    console.log(err);
                    response.end('截屏失败');
                })
            } else {
                sendFile(response, params.filename);
            }
        });
    } else if (request.url.substr(0, 6) == '/cache') {
        filename = __dirname + request.url;
        sendFile(response, filename);
    } else {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.end('不存在的请求地址');
    }
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

function sendFile(response, filename) {
    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + filename + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'image/png'
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });

}

function screen(params, callback, error) {
    var url = params.url;
    // var filename = './cache/' + md5.update(url).digest('hex') + '.png';

    var childArgs = [
        '--disk-cache=true',
        '--disk-cache-path=' + path.join(__dirname, 'cache/temp/'),
        path.join(__dirname, 'phantomjs-script.js'),
        params.url,
        params.filename,
        params.width ? params.width : 1024,
        params.height ? params.height : 600
    ];
    console.log(binPath);
    childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
        if (err) {
            error(err);
        } else {
            callback();
        }
        console.log('screen to: ' + params.filename);
    });
}
