var http = require('http');
var a=3;
http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html><html lang="en">' +
        '<head>' +
        '<\/head>' +
        '<body>' +
        '<H1>This is a Header</H1>'+
        '<script>print(a)' +
        '</script>'+
        '<\/body>' +
        '<\/html>');
    res.end();
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888');