'use strict';
var express = require('express');
var router = express.Router();
var url = "mongodb://localhost:27017";
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var engines = require('consolidate');
var path = require('path');
//var csv = require('csv-express');  //export
//Import
//var fileUpload = require('express-fileupload');
//var fs = require('fs');
//var server = require('http').Server(app);


//var nodemailer = require('nodemailer'); //email

//var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });
//require("../models/errOutput");
var app = express();

//var Users = mongoose.model('SKSNodeColl');

//app.use(fileUpload()); //import
//console.log(sUsers);


app.engine('html', engines.nunjucks);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//console.log('before get');
    
//var csvFile = path.join(__dirname, "/../public/files/users.csv");
//console.log(csvFile);
//var stream = fs.createReadStream(csvFile);
/* GET home page. */
/*
router.get('/', function (req, res) {
    Users.find({}).exec(function (err, users) {
        if (err) throw (err);            
        //console.log(users);
        res.render('userdetails.html', { users: SKSNodeColl});  
        //res.sendFile(path.join(__dirname, '../views/index.html'));        
    });    
});

//var newUser = Users({ firstName: "Smriti", lastName: "Garg" });
//newUser.save();
*/

router.get('/', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            throw err; 
        }
        var db = client.db("mydb");
        db.collection('SKSNodeColl').find({}).toArray(function (err, docs) {
            if (err) {
                throw err;
            }
            res.render('userdetails.html', { data: docs });
            client.close();
        });
    });
});

/*
router.get('/fetch', function (req, res, next) {
    var id = req.query.id;    
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) { throw err; }
        var db = client.db("mydb");
        db.collection('SKSNodeColl').find({ _id: new mongodb.ObjectID(id) }).toArray(function (err, docs) {
            if (err) throw err;
            console.log(docs);
            res.send(docs);
            client.close();
        });
    });
});


router.post('/add', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) { console.log(err); throw err; }
        var db = client.db("mydb");
        var collection = db.collection("Users");
        console.log("Mongo Connection");
        var User = { firstName: req.body.firstName, lastName: req.body.lastName, eMail: req.body.eMail, procPath: req.body.procPath, bkgroundInfo: req.body.bkgroundInfo };
        collection.insert(User, function (err, result) {
            console.log("User Created");
            client.close();
            res.redirect('/');
        });
    });
});

router.get('/delete', function (req, res, next) {
    var id = req.query.id;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) { throw err; }
        var db = client.db("mydb");
        var collection = db.collection("Users");
        collection.deleteOne({ '_id': new mongodb.ObjectId(id) }, function (err, result) {
            if (err) {
                throw err;
            } else {
                client.close();
                res.redirect('/');
            }
        });
    });
});

router.post('/edit', function (req, res, next) {
    var id = req.body.id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var eMail = req.body.eMail;
    var procPath = req.body.procPath;
    var bkgroundInfo = req.body.bkgroundInfo;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) { throw err; }
        var db = client.db("mydb");
        var collection = db.collection("Users");
        collection.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { 'firstName': firstName, 'lastName': lastName, 'eMail': eMail, 'procPath': procPath, 'bkgroundInfo': bkgroundInfo } }, function (err, result) {
            if (err) {
                throw err;
            } else {
                client.close();
                res.redirect('/');
            }
        });
    });
});

//Export functionality - start

router.get('/exporttocsv', function (req, res, next) {
    var filename = "users.csv";
    var dataArray;
    Users.find().lean().exec({}, function (err, users) {
        if (err) res.send(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=' + filename);
        res.csv(users, true);
    });
});

//Export functionality - end

//Import functionality - start

var template = require('./template.js');
router.get('/template', template.get);

var upload = require('./upload.js');
router.post('/import', upload.post);

//Import functionality - end

// newCollection for pattern matching start

var createGroups = function (db, callback) {
    var pipeline = [
        {
            $match: {
                $text: { $search: "Error" }
            }
        },
        {

            $project: {
                _id: 0,
                "result": { $cond: { if: { $gte: [{ $indexOfCP: ["$bkgroundInfo", "Error"] }, 0] }, then: { $substrCP: ["$bkgroundInfo", { $indexOfCP: ["$bkgroundInfo", "Error"] }, 140] }, else: "Not Found" } }
            }
        },
        {
            "$out": "SKSNodeColl"
        }
    ]
    db.aggregate(pipeline).toArray(function (err, result) {
        //assert.equal(err, null);
        console.log(result);
        callback(result);
    });
};

router.get('/newColl', function (req, res, next) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) { console.log(err); throw err; }
        var db = client.db("mydb");
        var collection = db.collection("Users");
        console.log("Mongo Connection - New Collection");
        createGroups(collection, function (err, result) {
            console.log("newCollection Created");
            var userdetails = path.join(__dirname, "/../views/userdetails.html");
            console.log(userdetails);
            client.close();            
            res.sendFile(userdetails);            
        });
    });         
});


router.post('/userdet', function (req, res, next) {
    var userdetails = path.join(__dirname, '../views/userdetails.html');
    console.log("userdet: " + userdetails);
    res.redirect(userdetails);    
});

// newCollection for pattern matching end

router.get('/test', function (req, res) {
    res.render('uploadFile.html');
});

router.post('/upload', uploadFileController.uploadCSV);

/*
router.get('/import', function (req, res, next) {
    var users = []
    var csvStream = csv()
        .on("data", function (data) {
            var user = new User({
                firstName = data[0],
                lastName = data[1],
                eMail = data[2]
            });

            user.save(function (error) {
                console.log(user);
                if (error) {
                    throw error;
                }
            });
        })
        .on("end", function () {

    });

    stream.pipe(csvStream);
    res.json({ success: "Data imported successfully.", status: 200 });
});
/*
router.get('/send', function (req, res) {

    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: 'sksorde@gmail.com',
            pass: 'xxxxx'
        }
    });
    var mailOptions = {
        to: req.query.to,
        subject: req.query.subject,
        text: req.query.text,
        from: 'sksorde@gmail.com',                        
        html: '<h1>Welcome</h1><p>NodeJS & MongoDB is a fun!</p>'
    };
    console.log(mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log('Email sent: ' + info.response);
            res.end("sent");
        }
    });
});
*/


module.exports = router;
