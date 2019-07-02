var mongoose = require("mongoose");
var users = require("../../models/users");
global.crypto = require('crypto');
var moment = require("moment");

const guid = function () { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); }); }

/*
	login validation methods
*/
var userDetails = {};

userDetails.autoLogin = function (user, pass, callback) {
    users.find({ user: user }, function (e, o) {
        if (o) {
            console.log(o);
            o.pass == pass ? callback(o) : callback(null);
        } else {
            callback(null);
        }
    });
}

userDetails.manualLogin = function (user, pass, callback) {
    users.findOne({ user: user }, function (e, o) {
        if (o == null) {
            callback('user-not-found');
        } else {
            console.log("manualLogin Res" + o)
            validatePassword(pass, o.pass, function (err, res) {
                if (res) {
                    console.log("validatePassword Success " + res);
                    callback(null, o);
                } else {
                    console.log("validatePassword " + err);
                    callback('invalid-password');
                }
            });
        }
    });
}

userDetails.generateLoginKey = function (user, ipAddress, callback) {
    let cookie = guid();
    users.findOneAndUpdate({ user: user }, {
        $set: {
            ip: ipAddress,
            cookie: cookie
        }
    }, { returnOriginal: false }, function (e, o) {
        callback(cookie);
    });
}

userDetails.validateLoginKey = function (cookie, ipAddress, callback) {
    // ensure the cookie maps to the user's last recorded ip address //
    console.log(cookie + "sks" + ipAddress);
    users.findOne({ cookie: cookie, ip: ipAddress }, callback);
}

userDetails.generatePasswordKey = function (email, ipAddress, callback) {
    let passKey = guid();
    users.findOneAndUpdate({ email: email }, {
        $set: {
            ip: ipAddress,
            passKey: passKey
        }, $unset: { cookie: '' }
    }, { returnOriginal: false }, function (e, o) {
        if (o.value != null) {
            callback(null, o.value);
        } else {
            callback(e || 'account not found');
        }
    });
}

userDetails.validatePasswordKey = function (passKey, ipAddress, callback) {
    // ensure the passKey maps to the user's last recorded ip address //
    users.findOne({ passKey: passKey, ip: ipAddress }, callback);
}

/*
	record insertion, update & deletion methods
*/

userDetails.addNewAccount = function (newData, callback) {
    console.log(newData);
    users.findOne({ user: newData.user }, function (e, o) {
        if (o) {
            callback('username-taken');
        } else {
            users.findOne({ email: newData.email }, function (e, o) {
                if (o) {
                    callback('email-taken');
                } else {
                    saltAndHash(newData.pass, function (hash) {
                        newData.pass = hash;
                        console.log("saltAndHash" + newData.pass);
                        // append date stamp when record was created //
                        newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        users.create(newData, callback);
                    });
                }
            });
        }
    });
}

userDetails.updateAccount = function (newData, callback) {
    let findOneAndUpdate = function (data) {
        var o = {
            name: data.name,
            email: data.email,
            country: data.country
        }
        if (data.pass) o.pass = data.pass;
        users.findOneAndUpdate({ _id: getObjectId(data.id) }, { $set: o }, { returnOriginal: false }, callback);
    }
    if (newData.pass == '') {
        findOneAndUpdate(newData);
    } else {
        console.log("salt&hash");
        saltAndHash(newData.pass, function (hash) {
            newData.pass = hash;
            findOneAndUpdate(newData);
        });
    }
}

userDetails.updatePassword = function (passKey, newPass, callback) {
    saltAndHash(newPass, function (hash) {
        newPass = hash;
        users.findOneAndUpdate({ passKey: passKey }, { $set: { pass: newPass }, $unset: { passKey: '' } }, { returnOriginal: false }, callback);
    });
}

/*
	account lookup methods
*/

userDetails.getAllRecords = function (callback) {
    users.find().toArray(
        function (e, res) {
            if (e) callback(e)
            else callback(null, res)
        });
}

userDetails.deleteAccount = function (id, callback) {
    users.deleteOne({ _id: getObjectId(id) }, callback);
}

userDetails.deleteAllusers = function (callback) {
    users.deleteMany({}, callback);
}

/*
	private encryption & validation methods
*/

var generateSalt = function () {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

var md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function (pass, callback) {
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
}

var validatePassword = function (plainPass, hashedPass, callback) {
    console.log("plainPass " + plainPass);
    console.log("hashedPass " + hashedPass);
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    console.log("salt " + salt);
    console.log("validHash " + validHash);
    callback(null, hashedPass === validHash);
}

var getObjectId = function (id) {
    return new require('mongodb').ObjectID(id);
}

var listIndexes = function () {
    users.indexes(null, function (e, indexes) {
        for (var i = 0; i < indexes.length; i++) console.log('index:', i, indexes[i]);
    });
}

module.exports = userDetails;