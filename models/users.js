var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    name: { type: String, Required: 'First name cannot be left blank.' },
    created: { type: Date, default: Date.now },
    createdby: String,
    email: String,
    user: String,
    pass: String,
    country: String,
    rememberPassword: String,
    cookie: String,
    ip: String,
    passKey: String
});

module.exports = mongoose.model('users', userSchema);