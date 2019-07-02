var express = require('express');
var router = express.Router();
var admin = require("../controllers/adminController.js");

// Create area
router.get('/admin/createArea', function (req, res) {
    admin.createArea(req, res);
});

// Save area
router.post('/admin/saveArea', function (req, res) {
    admin.saveArea(req, res);
});

module.exports = router;