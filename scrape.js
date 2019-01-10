let request = require('request');
let cheerio= require('cheerio');
let CSList=[];
let CSLink=[];
var CSRequirement=new Map();
var a=0;
request("http://bulletin.miamioh.edu/engineering-computing/computer-science-bs/", function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $("a[class='bubblelink code']").each(function (i, element) {
            var a = this.attribs.title;
            var link = "http://bulletin.miamioh.edu/" + this.attribs.href;
            CSLink.push(link);
            CSList.push(a);
        });
        console.log(CSList);
    }
});
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