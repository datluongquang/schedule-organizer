var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/YourDB";
function runschedule(){
    var checkedBoxes = getCheckedBoxes("chkbox");
    MongoClient.connect(url, function(err, db) {
        for(var i=0;i<num;i++) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection(document.getElementById("Subject").options[i]).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        }
        db.close();
    });
}
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("ComputerScience").find({}).toArray(function(err, result) {
//         if (err) throw err;
//         for(var i=0;i<result.length;i++){
//             console.log(result[i]["CourseName"])
//         }
//         db.close();
//     });
// });
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            console.log(checkboxes[i].value);
            checkboxesChecked.push(checkboxes[i].value);
        }
    }
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}