var csv = require('fast-csv');
var mongoose = require('mongoose');
var user = require("../models/Users");
 
exports.post = function (req, res) {
    console.log(req.files); //undefined
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var userFile = req.files.file;
 
    var Users = [];
	console.log("inside upload.js");
         
    csv
     .fromString(userFile.data.toString(), {
         headers: true,
         ignoreEmpty: false
     })
     .on("data", function(data){
         data['_id'] = new mongoose.Types.ObjectId();
         Users.push(data);
     })
     .on("end", function(){
         user.create(Users, function(err, documents) {
            if (err) throw err;
         });
          
		 res.redirect('/');
         //res.send(Users.length + ' Users have been successfully uploaded.');		
     });	 
};
