let request = require('request');
let cheerio= require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
let CSList=[];
let CSLink=[];
var CSRequirement=new Map();
var a={a:'b'};
request("http://bulletin.miamioh.edu/engineering-computing/computer-science-bs/", function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $("a[class='bubblelink code']").each(function (i, element) {
            var a = this.attribs.title;
            var link = "http://bulletin.miamioh.edu/" + this.attribs.href;
            CSLink.push(link);
            CSList.push(a);
        });
        MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("customers").removeMany({});
            for(var i=0;i<CSList.length;i++){
                a={Name:CSList[i],Link:CSLink[i]};
                dbo.collection("customers").insertOne(a);
            }
            db.close();
        });
    }
});


// MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").find({}).toArray(function(err, result) {
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });
function forward(url) {
    var pre=[];
    request2(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $("a[class='bubblelink code']").each(function (i,element) {
                var a= this.attribs.title;
                pre.push(a);
                console.log(pre);
            })
        }
    });
    return pre;
}