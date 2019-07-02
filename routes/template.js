var json2csv = require('json2csv');
 
exports.get = function(req, res) {
    console.log("templatecsv");

    var fields = [
        'firstName',
        'lastName',
        'eMail'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=Users.csv");
    res.set("Content-Type", "application/octet-stream");
    console.log(csv);
 
    res.send(csv);
 
};
