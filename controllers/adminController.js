var mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;
var Area = require("../models/area");
var Workaround = require("../models/workaround");

var generic = require("../routes/genericFunctions");

var adminController = {};

// ****************AREA - START****************
// Create area
adminController.createArea = function (req, res) {
    res.render("../views/admin/createArea");
};

// Save area
adminController.saveArea = function (req, res) {
    var area = new Area(req.body);
    console.log("SaveArea: " + area);
    area.save(function (err) {
        if (err) {
            console.log("SKS SaveArea Error: " + err);            
        } else {            
            console.log("Area created!!");
            res.redirect("/admin/listArea");
        }
    });
};

//Show area
adminController.listArea = function (req, res) {
    Area
        .find({})
        .sort({ 'area': 1 })
        .exec(function (err, area) {
            if (err) {
                console.log("Error:", err);
            }
            else {
                res.render('../views/admin/listArea', { area: area });                
            }
        });
};

// Delete area
adminController.deleteArea = function (req, res) {
    var items = [];
    for (var key in req.body) {
        items = req.body[key];
    }
    Area.deleteMany({ _id: { $in: items } }, function (err, area) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render('../views/admin/listArea', { area: area });
        }
    });
};
// ****************AREA - END****************

// ****************WORKAROUND - START****************
//Create workaround
adminController.createWorkaround = function (req, res) {
    res.render("../views/admin/createWorkaround");
};

//Save workaround
adminController.saveWorkaround = function (req, res) {
    var workaround = new Workaround(req.body);
    workaround.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Workaround created!!");
            res.redirect("/admin/listWorkaround");
        }
    });
};

//Show workaround
adminController.listWorkaround = function (req, res) {
    Workaround
        .find({})
        .exec(function (err, workaround) {
            if (err) {
                console.log("Error:", err);
            }
            else {
                res.render('../views/admin/listWorkaround', { workaround: workaround });
            }
        });
};

// Delete workaround
adminController.deleteWorkaround = function (req, res) {
    var items = [];
    for (var key in req.body) {
        items = req.body[key];
    }
    Workaround.deleteMany({ id: { $in: items } }, function (err, workaround) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render('../views/admin/listWorkaround', { workaround: workaround });
        }
    });
};
//**************** WORKAROUND - END****************

module.exports = adminController;