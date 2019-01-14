let request = require('request');
let cheerio= require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    function addPre(primitiveData,finalDatabase) {
        var dbo = db.db("mydb");
        dbo.collection(finalDatabase).removeMany({});
        dbo.collection(primitiveData).find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var courseName = result[i]["Name"];
                var courseLink = result[i]["Link"];
                function forward(courseName, courseLink) {
                    var pre = [];
                    request(courseLink, function (error, response, html) {
                        if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);
                            $("a[class='bubblelink code']").each(function (i, element) {
                                var a = this.attribs.title;
                                pre.push(a);
                            });
                            var full = {CourseName: courseName, Prerequisite: pre};
                            console.log(full);
                            dbo.collection(finalDatabase).insertOne(full, function (err, res) {
                                if (err) throw err;
                                console.log(full);
                            });
                        }
                    });
                }

                forward(courseName, courseLink)
            }
            // db.close();
        });
    }
    addPre("ComputerScienceLink","ComputerScience");
    addPre("ComputerEngineeringLink","ComputerEngineering")
});