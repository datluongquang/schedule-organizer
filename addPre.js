let request = require('request');
let cheerio= require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo=db.db("mydb");
    dbo.collection("SubjectFinal").removeMany({});
    dbo.collection("subject").find({}).toArray(function (err,results) {
        if (err) throw err;
        var count=0;
        for(var i=0;i<results.length;i++){
            var link=results[i]["link"];
            var CourseName=results[i]["CourseName"];
            addPreCo(link,CourseName);
            function addPreCo(link,CourseName) {
                request(link, function (error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var Pre=[];
                        var Co=[];
                        var temporary=[];
                        var cur="";
                        var $ = cheerio.load(html);
                        var context=$("p[class='courseblockdesc']")['0']['children'];
                        var skipMTH251=false;
                        for(var k=0;k<context.length;k++){
                            if(context[k]['type']==='tag'){
                                var title=context[k].attribs.title;
                                if(title!=null) {
                                    if((title.includes('MTH 251')||title.includes('MTH 249H'))&&skipMTH251){
                                        continue;
                                    }
                                    if(title.includes('MTH 249')||title.includes('MTH 249H')){
                                        title='MTH 251';
                                        skipMTH251=true;
                                    }
                                    temporary.push(title);
                                    if ((!context[k]['next']['data'].includes(' or ')||(context[k]['next']['data'].includes(' or equivalent'))||(context[k]['next']['data'].includes('or permission of instructor'))) && temporary.length > 0) {
                                        if (cur === "Pre") {
                                            Pre.push(temporary)
                                        }
                                        else if (cur === "Co") {
                                            Co.push(temporary)
                                        }
                                        temporary = []
                                    }
                                }
                            }
                            else {
                                if (context[k]['data'].includes('Prerequisite')) {
                                    cur = "Pre";
                                }
                                else if (context[k]['data'].includes('Co-requisite')) {
                                    cur = "Co";
                                }
                            }
                        }
                        var dummy= {CourseName:CourseName, Prerequisite:Pre,CoRequisite:Co};
                        dbo.collection("SubjectFinal").insertOne(dummy);
                        count++;
                        console.log(dummy);
                        console.log(link);
                        if(count===results.length){
                            db.close()
                        }
                    }
                });
            }
        }
    })
});
