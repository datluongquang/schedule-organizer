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
var url = "mongodb://localhost:27017/YourDB";
var app= express();
var bodyParser=require('body-parser');
var MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get("/",(req,res)=>{
    res.render('test')
});
app.post('/getSubject',(req,res)=>{
    var checkedBoxes = req.body["chkbox"];
    console.log(checkedBoxes);// Only checked box will be return
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        var num=checkedBoxes.length;
        MongoClient.connect(url, function (err, db) {
            for (var i = 0; i < num; i++) {
                if (err) throw err;
                var dbo = db.db("mydb");
                var results = dbo.collection(checkedBoxes[i]).find({}).toArray();
                console.log(results)
            }
            db.close();
        });
    });
    res.redirect('/');
});
app.listen(3000, () => {
    console.log('Server listing on 3000');
});
// function getCheckedBoxes(chkboxName) {
//     var checkboxes = document.getElementsByName(chkboxName);
//     var checkboxesChecked = [];
//     for (var i=0; i<checkboxes.length; i++) {
//         if (checkboxes[i].checked) {
//             console.log(checkboxes[i].value);
//             checkboxesChecked.push(checkboxes[i].value);
//         }
//     }
//     return checkboxesChecked.length > 0 ? checkboxesChecked : null;
// }