// var http = require('http');
// var a=3;
// http.createServer(function(req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     var a=3;
//     res.write(
//         '<!doctype html><html lang="en">' +
//         '<head>' +
//         '<script>console.log(a)</script>'+
//         '<\/head>' +
//         '<body>' +
//         '<H1>a</H1>'+
//         '<script>var MongoClient = require(\'mongodb\').MongoClient;'+
//         '</script>'+
//         '<\/body>' +
//         '<\/html>');
//     res.end();
// }).listen(8888, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:8888');
var express= require('express');
var app= express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get("/",(req,res)=>{
    res.render('test')
});
app.listen(3000, () => {
    console.log('Server listing on 3000');
});