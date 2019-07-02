var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var database = require('./models/database');

var fileUpload = require('express-fileupload');		
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


process.env.DB_HOST = process.env.DB_HOST || 'localhost'
process.env.DB_PORT = process.env.DB_PORT || 27017;
process.env.DB_NAME = process.env.DB_NAME || 'inc';
process.env.DB_URL = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;
/*
if (app.get('env') != 'live') {
    process.env.DB_URL = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;
} else {
    // prepend url with authentication credentials // 
    process.env.DB_URL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT;
}
*/

//Remote connection with Azure cosmos db:
//mongoose.connect(database.localurl); mongodb://localhost/inc
//mongoose.connect(database.remoteurl);

var connection = mongoose.connect(database.sremoteurl, function (err) {
    //console.log(database.remoteurl);
    if (err) { console.log(err) }
    var admin = new mongoose.mongo.Admin(mongoose.connection.db);
    admin.buildInfo(function (err, info) {
        console.log(info.version);
        console.log('connection successful');
    });
});

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());	
app.use(express.static(path.join(__dirname, 'public')));
app.use("/includes/", express.static(path.join(__dirname, 'views', 'includes')));
app.use("/controllers/", express.static(path.join(__dirname, 'controllers')));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));

app.use("/validators/", express.static(path.join(__dirname, 'validators')));
app.use("/modals/", express.static(path.join(__dirname, 'views', 'modals')));
app.use("/admin/", express.static(path.join(__dirname, 'views', 'admin')));
app.use(express.static(path.join(__dirname, 'views')));
app.use("/modules/", express.static(path.join(__dirname, 'public', 'modules')));

/*
app.use(express.session({
    cookie: {
        path: '/',
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000
    },
    secret: '1234567890QWERT'
}));
*/

app.use(session({
    secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    //store: new MongoStore({ url: process.env.DB_URL })  //SKS: 25June2019: Commented due to error
})
);

app.use('/', index);
//app.use('/incident', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
