let request = require('request');
let cheerio= require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
// function getCourse(link,database) {
//     request(link, function (error, response, html) {
//         if (!error && response.statusCode == 200) {
//             var $ = cheerio.load(html);
//             let CSList=[];
//             let CSLink=[];
//             $("a[class='bubblelink code']").each(function (i, element) {
//                 var a = this.attribs.title;
//                 var link = "http://bulletin.miamioh.edu/" + this.attribs.href;
//                 CSLink.push(link);
//                 CSList.push(a);
//             });
//             MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
//                 if (err) throw err;
//                 var dbo = db.db("mydb");
//                 dbo.collection(database).removeMany({});
//                 for (var i = 0; i < CSList.length; i++) {
//                     a = {Name: CSList[i], Link: CSLink[i]};
//                     dbo.collection(database).insertOne(a);
//                 }
//                 db.close();
//             });
//         }
//     });
// }
var MajorCount=2;
var count=0;
function getCourse(link,database) {
    request(link, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            let CSList=[];
            let section=[];
            let subjectList=[];
            var rows = $(".sc_courselist").find("tr");
            var type;
            for (var i = 0; i<rows.length; i++) {
                var current = rows[i];
                var className = current.attribs.class;
                function getComment(current){
                    var temp=$(current)['0']['children'][0];
                    while(temp['data']==null){
                        temp=temp['children'][0]
                    }
                    return temp['data'];
                }
                function addToFinal() {
                    if(section.length>0) {
                        var temp = {SectionList: section, Type: type};
                        CSList.push(temp);
                        section=[]
                    }
                }
                if(className.includes('odd areaheader')||className.includes('even areaheader')||className.includes('even firstrow')||className.includes('odd firstrow')){
                    addToFinal();
                    type= getComment(current);
                }
                else if(className.includes('orclass odd')||className.includes('orclass even')){
                    var temp=$(current).find("[class ='bubblelink code']");
                    var course= temp['0'];
                    if(course==null){
                        addToFinal();
                        type=getComment(current);
                    }
                    else {
                        var a={CourseName:course.attribs.title};
                        section[section.length-1].push(a);
                        var b = {CourseName:course.attribs.title, link:"http://bulletin.miamioh.edu/"+course.attribs.href};
                        subjectList.push(b);
                    }
                }
                else if(className==='odd'||className==='even'||className==='odd lastrow'||className==='even lastrow'){
                    var temp=$(current).find("[class ='bubblelink code']");
                    var course= temp['0'];
                    if(course==null){
                        addToFinal();
                        type=getComment(current);
                    }
                    else {
                        if(temp.length>1){
                            var prev=course.prev;
                            if(prev!=null&& prev.type==='text'&&(prev.data.includes("Any")||prev.data.includes("any"))){
                                var exchangable = [];
                                for(var j=0;j<temp.length;j++){
                                    course=temp[''+j];
                                    var a = {CourseName: course.attribs.title};
                                    exchangable.push(a);
                                    var b = {CourseName:course.attribs.title, link:"http://bulletin.miamioh.edu/"+course.attribs.href};
                                    subjectList.push(b);
                                }
                                section.push(exchangable)
                            }
                            else {
                                var courseTotal=[];
                                for(var j=0;j<temp.length;j++){
                                    course=temp[''+j];
                                    courseTotal.push(course.attribs.title);
                                    var b = {CourseName:course.attribs.title, link:"http://bulletin.miamioh.edu/"+course.attribs.href};
                                    subjectList.push(b);
                                }
                                var a = {CourseName: courseTotal};
                                var exchangable = [];
                                exchangable.push(a);
                                section.push(exchangable)
                            }
                        }
                        else {
                            var a = {CourseName: course.attribs.title};
                            var exchangable = [];
                            exchangable.push(a);
                            var b = {CourseName:course.attribs.title, link:"http://bulletin.miamioh.edu/"+course.attribs.href};
                            subjectList.push(b);
                            section.push(exchangable)
                        }
                    }
                }
                else if(className.includes('listsum')){
                    addToFinal()
                }
            }
            MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
                count++;
                if (err) throw err;
                var dbo = db.db("mydb");
                var i;
                var j;
                dbo.collection(database).removeMany({});
                for (i = 0; i < CSList.length; i++) {
                    dbo.collection(database).insertOne(CSList[i]);
                    console.log(CSList[i]['SectionList']);
                    console.log(CSList[i]['Type'])
                }
                for(j=0;j<subjectList.length;j++){
                    var dummy= subjectList[j];
                    function checkInclude(dummy) {
                        dbo.collection("subject").find(dummy).toArray(function (err, results) {
                            if (err) throw err;
                            if (results.length === 0) {
                                dbo.collection("subject").insertOne(dummy);
                            }
                        })
                    }
                    checkInclude(dummy)
                }
                if(i===CSList.length&&j===subjectList.length&&count===MajorCount) {
                    db.close();
                }
            });
        }
    });
}
// getCourse("http://bulletin.miamioh.edu/engineering-computing/computer-science-bs/","ComputerScience");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/computer-bse/","ComputerEngineering");
// getCourse("http://bulletin.miamioh.edu/farmer-business/accountancy-bsb/","Accountancy");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/software-bs/","SoftwareEngineering");// Havent add software engineering specialize area http://miamioh.edu/cec/academics/departments/cse/academics/majors/specialization-areas/index.html
// getCourse("http://bulletin.miamioh.edu/engineering-computing/bioengineering-bse/","BioEngineering");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/chemical-bse/","ChemicalEngineering");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/electrical-bse/","Electrical Engineering");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/general-bse/","GeneralEngineering");// Havent add a Engineering minor requirement
// getCourse("http://bulletin.miamioh.edu/engineering-computing/management-bse/","EngineeringManagement");
// getCourse("http://bulletin.miamioh.edu/arts-science/engineering-physics-bs/","EngineeringPhysics"); //Havent add a Engineering minor requirement
// getCourse("http://bulletin.miamioh.edu/engineering-computing/manufacturing-bse/","ManufacturingEngineering");
// getCourse("http://bulletin.miamioh.edu/engineering-computing/mechanical-bse/","MechanicalEngineering");
// getCourse("http://bulletin.miamioh.edu/farmer-business/information-systems-analytics-bsb/","InformationSystemAndAnalytics");
// getCourse("http://bulletin.miamioh.edu/farmer-business/finance-bsb/","Finance"); //Havent add the 12 hours electives
// getCourse("http://bulletin.miamioh.edu/farmer-business/interdisciplinary-business-management-bsb/","InterdisciplinaryBusinessManagement");
// getCourse("http://bulletin.miamioh.edu/farmer-business/marketing-bsb/","Marketing");
// getCourse("http://bulletin.miamioh.edu/arts-science/anthropology-ba/","Anthropology");
// getCourse("http://bulletin.miamioh.edu/farmer-business/business-economics-bsb//","Economics"); //Havent add the electives
// getCourse("http://bulletin.miamioh.edu/arts-science/geography-ba/","Geography");
// getCourse("http://bulletin.miamioh.edu/arts-science/gerontology-ba/","Gerontology");
// getCourse("http://bulletin.miamioh.edu/arts-science/global-and-intercultural-studies/","GlobalAndInterculturalStudies");
// getCourse("http://bulletin.miamioh.edu/arts-science/psychology-ba/","Psychology");
// getCourse("http://bulletin.miamioh.edu/arts-science/public-health-ba/","PublicHealth");
// getCourse("http://bulletin.miamioh.edu/arts-science/social-justice-studies-ba/","SocialJusticeStudies");
// getCourse("http://bulletin.miamioh.edu/arts-science/sociology-ba/","Sociology"); //Havent correctly scraped
// getCourse("http://bulletin.miamioh.edu/farmer-business/analytics-comajor/","Analytics"); //Havent catch the track
// getCourse("http://bulletin.miamioh.edu/arts-science/biochemistry-bs/","Biochemistry");
getCourse("http://bulletin.miamioh.edu/arts-science/biological-physics-bs/","BioPhysical");

