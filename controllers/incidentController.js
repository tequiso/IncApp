var mongoose = require("mongoose");

var ObjectId = mongoose.Types.ObjectId;
var Incident = require("../models/incident");
var Area = require("../models/area");
var Workaround = require("../models/workaround");
var users = require("../models/users");

var generic = require("../routes/genericFunctions");

var csvimport = require('fast-csv');
var csv = require('csv-express');

var incidentController = {};

incidentController.list = function (req, res) {
    var find = {};
    pagination(req, res, find);
};

incidentController.home = function (req, res) {
    var find = {};
    pagination(req, res, find);    
};

incidentController.openlist = function (req, res) {
    var find = { status: "Open" };
    pagination(req, res, find);    
};

// Show incidents by id
incidentController.show = function (req, res) {
    var id = parseInt(req.params.id);
    console.log(id);

    Incident.findOne({ id_num: id }).sort({ 'updates.updated': -1 }).exec(function (err, incidents) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            var pipeline = [
                {
                    "$match": { "id_num": id }
                },
                {
                    "$unwind": "$updates"
                },
                {
                    "$sort": {
                        "updates.updated": -1
                    }
                },
                {
                    "$group": {
                        "updates": {
                            "$push": "$updates"
                        },
                        "_id": 1
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "updates": 1
                    }
                },
                {
                    "$unwind": "$updates"
                }
            ]
            Incident.aggregate(pipeline, function (error, incidentUpdates) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(incidentUpdates);
                    var user;
                    if (req.session.user != "undefined") {
                        user = req.session.user.name;
                        //console.log("Pagination UserName: " + req.query.user);
                        console.log("Pagination : " + req.session.user.name);
                    }
                    res.render("../views/show", { incidents: incidents, incidentUpdates: incidentUpdates, userName: user });
                }
            });
        }
    });
};

incidentController.saveChild = function (req, res) {
    var incident = new Incident(req.body);
    var id = req.params.id;
    console.log(req.params.id);
    console.log(req.body.comments);
    console.log(req.body);
    var cmnts = {
        "comments": req.body.comments, "updatedby": req.body.updatedby
    };

    Incident.findOneAndUpdate({ id_num: req.params.id }, { $set: { status: req.body.status, workingteam: req.body.workingteam, priority: req.body.priority }, $push: { updates: cmnts } }, function (error, incidents) {
        if (error) {
            console.log(error);
        } else {
            //incident.save();
            res.redirect("/show/" + incidents.id_num);
        }
    });
};

// Create new incidents - added area to fetch details from area schema for dropdown
incidentController.create = function (req, res) {
    Area.find({}).exec(function (err, area) {
        var user;
        if (req.session.user != "undefined") {
            user = req.session.user.name;
            //console.log("Pagination UserName: " + req.query.user);
            console.log("Pagination : " + req.session.user.name);
        }
        res.render("../views/create", { area: area, userName: user });
    });    
};

// Save new incidents
incidentController.save = function (req, res) {
    var incident = new Incident(req.body);
    incident.save(function (err) {
        if (err) {
            console.log(err);
            res.render("../views/create");
        } else {
            res.redirect("/show/" + incident.id_num);
        }
    });
};

// Edit an incidents
incidentController.edit = function (req, res) {
    Incident.findOne({ id_num: req.params.id }).exec(function (err, incidents) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            var user;
            if (req.session.user != "undefined") {
                user = req.session.user.name;
                //console.log("Pagination UserName: " + req.query.user);
                console.log("Pagination : " + req.session.user.name);
            }
            res.render("../views/edit", { incidents: incidents, userName: user });
        }
    });
};

// Update an incidents
incidentController.update = function (req, res) {
    Incident.findByIdAndUpdate(req.params.id, { $set: { raisedby: req.body.raisedby, address: req.body.location, teamleader: req.body.teamleader, team: req.body.team, otherupdates: req.body.otherupdates } }, { new: true }, function (err, incidents) {
        if (err) {
            console.log(err);
            res.render("../views/edit", { incidents: req.body });
        }
        //console.log('inside controller incident id is:' + incidents._id);
        res.redirect("/show/" + incidents.id_num);
    });
};

// Delete multiple incidents
incidentController.deleteMany = function (req, res) {
    var items = [];
    for (var key in req.body) {
        items = req.body[key];
    }
    Incident.deleteMany({ _id: { $in: items } }, function (err, incidents) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
};

incidentController.ply = function (req, res) {
    var find = { area: 'PLY' };
    pagination(req, res, find);
};

incidentController.HAS = function (req, res) {
    var find = { area: 'HAS' };
    pagination(req, res, find);    
};

incidentController.stage3 = function (req, res) {
    var find = { workingteam: 'stage3' };
    pagination(req, res, find);    
};

incidentController.TTT = function (req, res) {
    var find = { area: 'TTT' };
    pagination(req, res, find);
};

incidentController.AACconsult = function (req, res) {
    var find = { area: 'TTT' };
    pagination(req, res, find);
};

incidentController.over21days = function (req, res) {
    var find = { area: 'TTT' };
    pagination(req, res, find);
};

incidentController.seg5 = function (req, res) {
    var find = { area: 'TTT' };
    pagination(req, res, find);
};

incidentController.localtriage = function (req, res) {
    var find = { area: 'TTT' };
    pagination(req, res, find);
};

incidentController.quicklist = function (req, res) {
    var find = {};
    pagination(req, res, find);
};

incidentController.import = function (req, res) {
    var user;
    if (req.session.user != "undefined") {
        user = req.session.user.name;
        //console.log("Pagination UserName: " + req.query.user);
        console.log("Pagination : " + req.session.user.name);
    }
    res.render("../views/import", { userName: user });
};

incidentController.importSave = function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files are uploaded.');
    }

    var incidentFile = req.files.file;
    var incidents = [];
    csvimport
        .fromString(incidentFile.data.toString(), {
            headers: true,
            ignoreEmpty: false
        })
        .on("data", function (data) {
            data['_id'] = new mongoose.Types.ObjectId();

            incidents.push(data);
        })
        .on("end", function () {
            Incident.create(incidents, function (err, incidents) {
                if (err) {
                    console.log("Error :" + err);
                    throw err;
                }
                else {
                    //pagination();
                    Incident.find({}).exec(function (err, incidents) {
                        if (err) {
                            console.log("Error:", err);
                        }
                        else {
                            res.render("../views/index", { incidents: incidents, userName: req.session.user.name });
                        }
                    });
                }
            });
        });
};

incidentController.export = function (req, res) {
    //const tsFormat = (new Date()).toLocaleDateString() + '-' + (new Date()).toLocaleTimeString();
    //const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14);
    const currentDate = generic.currentDate().toString();
    var filename = "incident" + currentDate + ".csv";
    var dataArray;
    var pipeline = ptrnpipeline();
    //Incident.find({}).lean().exec(function (err, incidents) {
    Incident.aggregate(pipeline, function (err, incidents) {
        if (err) {
            console.log("Error :" + err);
        }
        else {
            res.setHeader('Content-Type', 'text/csv');
            //res.setHeader('charset', 'UTF - 8');
            res.setHeader("Content-Disposition", "filename=" + filename);
            res.csv(incidents, true);
        }
    });
};

//*************SEARCH & PATTERN SEARCH - START****************
incidentController.search = function (req, res) {
    var user;
    if (req.session.user != "undefined") {
        user = req.session.user.name;
        //console.log("Pagination UserName: " + req.query.user);
        console.log("Pagination : " + req.session.user.name);
    }
    res.render("../views/search", { userName: user });
};

incidentController.searchResult = function (req, res) {
    var srnum = req.query.search;
    /*   const query = req.query.search;
        // emulate mongoose query
        const result = data.filter(item => new RegExp(query, 'i').test(item.text));
        res.render('search/partial', { result });
     */
    Incident.find({ srnumber: srnum }).exec(function (err, incidents) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render("../views/searchResult", { incidents: incidents });
        }
    });
};

incidentController.searchAAC = function (req, res) {
    var aacId = req.query.aacId;
    var strId = aacId.substring(3);
    Incident.find({ id_num: strId }).exec(function (err, incidents) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(incidents);
            res.render("../views/searchResult", { incidents: incidents });
        }
    });
};

//patternMatch - start
incidentController.pattern = function (req, res) {
    var user;
    if (req.session.user != "undefined") {
        user = req.session.user.name;
        //console.log("Pagination UserName: " + req.query.user);
        console.log("Pagination : " + req.session.user.name);
    }
    res.render("../views/pattern", { userName: user });
};

incidentController.patternResult = function (req, res) {
    var srchText = req.query.searchText ? req.query.searchText : "Error";

    var pipeline = [
        {
            $match: {
                $text: { $search: srchText }
            }
        },
        {
            $project: {
                _id: 0,
                area: 1,
                id: 1,
                location: 1,
                teamleader: 1,
                subarea: 1,
                srnumber: 1,
                srsubstatus: 1,
                bginfo: 1,
                error_msg: 1,
                procedural_path: 1,
                "result": {
                    $cond: {
                        if: {
                            $gte: [{ $indexOfCP: ["$error_msg", srchText] }, 0]
                        },
                        then: {
                            $substrCP: ["$error_msg", { $indexOfCP: ["$error_msg", srchText] }, 140]
                        },
                        else: {
                            $cond: {
                                if: {
                                    $gte: [{ $indexOfCP: ["$bginfo", srchText] }, 0]
                                },
                                then: {
                                    $substrCP: ["$bginfo", { $indexOfCP: ["$bginfo", srchText] }, 140]
                                },
                                else: "NOT FOUND"
                            }
                        }
                    }
                }
            }
        }
    ]
    Incident.aggregate(pipeline, function (error, result) {
        if (error) {
            console.log("SKS Error: " + error);
        } else {
            res.render("../views/patternResult", { incidents: result });
        }
    });
};

incidentController.patternResultWkaround = function (req, res) {
    //console.log("TestWK :" + req.query.searchWrkArnd);
    var srchText = req.query.searchWrkArnd ? req.query.searchWrkArnd : "Change";
    //var srchText = req.query.searchWrkArnd;

    var pipeline = [
        {
            $match: {
                $text: { $search: srchText }
            }
        }
    ]
    Workaround.aggregate(pipeline, function (error, result) {
        if (error) {
            console.log("SKS Error: " + error);
        } else {
            res.render("../views/patternResultWorkaround", { incidents: result });
        }
    });
};

function ptrnpipeline() {
    var srchText = "Error";
    var pipeline = [
        {
            $match: {
                $text: { $search: srchText }
            }
        },
        {
            $project: {
                _id: 0,
                area: 1,
                id: 1,
                location: 1,
                teamleader: 1,
                subarea: 1,
                srnumber: 1,
                srsubstatus: 1,
                bginfo: 1,
                error_msg: 1,
                procedural_path: 1,
                "result": { $cond: { if: { $gte: [{ $indexOfCP: ["$error_msg", srchText] }, 0] }, then: { $substrCP: ["$error_msg", { $indexOfCP: ["$error_msg", srchText] }, 140] }, else: "Not Found" } }
            }
        }
    ]
    return pipeline;
}

incidentController.ptrnAAC = function (req, res) {
    var aacId = req.query.aacId;
    console.log(aacId); //ply8
    var strId = aacId.substring(3);
    console.log(strId); //8
    Incident.find({ id_num: strId }).exec(function (err, incidents) {
        if (err) {
            console.log("Error:", err);
        }
        else {
            console.log(incidents);
            var proc = incidents[0].procedural_path.split("/").pop();
            var strProc = proc.trim();
            console.log(strProc); //getting error message
            var srchText = strProc ? strProc : "Default";
            //var srchText = req.query.searchWrkArnd;

            var pipeline = [
                {
                    $match: {
                        $text: { $search: srchText }
                    }
                }
            ]
            Workaround.aggregate(pipeline, function (error, result) {
                if (error) {
                    console.log("SKS Error: " + error);
                } else {
                    res.render("../views/patternResultWorkaround", { incidents: result });
                }
            });
            // here call a function to check keyword in error_msg
            // define_keywords in new collection -- for time being hardcode it
            // On a second thought, query on procedure_path and get extreme right side and search on that.

            //res.render("../views/searchResult", { incidents: incidents });
        }
    });
};
//patternMatch - end
//*************SEARCH & PATTERN SEARCH - END****************

//*************PAGINATION - START****************
function pagination(req, res, query) {
    var user;
    if (req.session.user != "undefined") {
        user = req.session.user.name;
        //console.log("Pagination UserName: " + req.query.user);
        console.log("Pagination : " + req.session.user.name);
    }    
    var perPage = 8;
    var page = parseInt(req.params.page) || 1;

    if (page < 0 || page === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }

    Incident
        .find(query)
        .sort({ 'created': -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, incidents) {
            if (err) {
                console.log("Error:", err);
            }
            else {
                Incident.find(query).count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('../views/home', {
                        userName: user,
                        incidents: incidents,
                        current: page,
                        count: count,
                        pages: Math.ceil(count / perPage)
                    });
                });
            }
        });
}
//*************PAGINATION - END****************

module.exports = incidentController;