var express = require('express');
var router = express.Router();
var incident = require("../controllers/incidentController.js");
var admin = require("../controllers/adminController.js");
var login = require("../controllers/loginController.js");

// Get all incidents
router.get('/', function (req, res) {
    login.home(req, res);
});

router.post('/', function (req, res) {
    login.signIn(req, res);
});

router.get('/signup', function (req, res) {
    login.signup(req, res);    
});

router.post('/signup', function (req, res) {
    login.signupSave(req, res);    
});

router.get('/logout', function (req, res) {
    login.logout(req, res);    
})

router.get('/incident/:page', function (req, res, next) {
    incident.openlist(req, res);
});

router.get('/home', function (req, res) {
    incident.list(req, res);
});

router.post('/home', function (req, res) {
    incident.list(req, res);
});

router.post('/deleteMany', function (req, res) {
    incident.deleteMany(req, res);
});

// Get single incident by id
router.get('/show/:id', function (req, res) {
    incident.show(req, res);
});

// Create 
router.get('/create', function (req, res) {
    incident.create(req, res);
});

// Save 
router.post('/save', function (req, res) {
    incident.save(req, res);
});

// Edit 
router.get('/edit/:id', function (req, res) {
    incident.edit(req, res);
});

// Update
router.post('/update/:id', function (req, res) {
    incident.update(req, res);
});

// Delete
router.post('/delete/:id', function (req, res, next) {
    incident.delete(req, res);
});

router.post('/addUpdateArray/:id', function (req, res) {
    incident.saveChild(req, res);
});

router.get('/ply', function (req, res, next) {
    incident.ply(req, res);
});

router.get('/homep/:page', function (req, res, next) {
    incident.home(req, res);
});

router.get('/stage3', function (req, res, next) {
    incident.stage3(req, res);
});

router.get('/TTT', function (req, res, next) {
    incident.TTT(req, res);
});

router.get('/HAS', function (req, res, next) {
    incident.HAS(req, res);
});

router.get('/AACconsult', function (req, res, next) {
    incident.AACconsult(req, res);
});

router.get('/over21days', function (req, res, next) {
    incident.over21days(req, res);
});

router.get('/seg5', function (req, res, next) {
    incident.seg5(req, res);
});

router.get('/localtriage', function (req, res, next) {
    incident.localtriage(req, res);
});

router.get('/quicklist', function (req, res, next) {
    incident.quicklist(req, res);
});

router.get('/import', function (req, res, next) {
    incident.import(req, res);
});

router.post('/importSave', function (req, res, next) {
    incident.importSave(req, res);
});

router.get('/export', function (req, res, next) {
    incident.export(req, res);
});


//*************SEARCH & PATTERN SEARCH - START****************
router.get('/search', function (req, res, next) {
    incident.search(req, res);
});

router.get('/searchResult?:search', function (req, res, next) {
    incident.searchResult(req, res);
});

router.get('/searchAAC?:aacId', function (req, res, next) {
    incident.searchAAC(req, res);
});

router.get('/pattern', function (req, res, next) {
    incident.pattern(req, res);
});

router.get('/patternResult?:searchText', function (req, res, next) {
    incident.patternResult(req, res);
});

router.get('/patternWrk?:searchWrkArnd', function (req, res, next) {
    incident.patternResultWkaround(req, res);
});

router.get('/ptrnAAC?:aacId', function (req, res, next) {
    incident.ptrnAAC(req, res);
});
//*************SEARCH & PATTERN SEARCH - END****************

//*************ADMIN PAGES - START****************
// AREA - START
router.get('/admin/createArea', function (req, res) {
    admin.createArea(req, res);
});

router.post('/admin/saveArea', function (req, res) {
    admin.saveArea(req, res);
});

router.get('/admin/listArea', function (req, res) {
    admin.listArea(req, res);
});

router.post('/admin/deleteArea', function (req, res) {
    admin.deleteArea(req, res);
});
// AREA - END
// WORKAROUND - START
router.get('/admin/createWorkaround', function (req, res) {
    admin.createWorkaround(req, res);
});

router.post('/admin/saveWorkaround', function (req, res) {
    admin.saveWorkaround(req, res);
});

router.get('/admin/listWorkaround', function (req, res) {
    admin.listWorkaround(req, res);
});

router.post('/admin/deleteWorkaround', function (req, res) {
    admin.deleteWorkaround(req, res);
});
// WORKAROUND - END
//*************ADMIN PAGES - END****************

module.exports = router;