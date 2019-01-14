let request = require('request');
let cheerio= require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
var a={a:'b'};
function getCourse(link,database) {
    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            let CSList=[];
            let CSLink=[];
            $("a[class='bubblelink code']").each(function (i, element) {
                var a = this.attribs.title;
                var link = "http://bulletin.miamioh.edu/" + this.attribs.href;
                CSLink.push(link);
                CSList.push(a);
            });
            MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                dbo.collection(database).removeMany({});
                for (var i = 0; i < CSList.length; i++) {
                    a = {Name: CSList[i], Link: CSLink[i]};
                    dbo.collection(database).insertOne(a);
                }
                db.close();
            });
        }
    });
}
getCourse("http://bulletin.miamioh.edu/engineering-computing/computer-science-bs/","ComputerScienceLink");
getCourse("http://bulletin.miamioh.edu/engineering-computing/computer-bse/","ComputerEngineeringLink");