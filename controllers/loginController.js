var mongoose = require("mongoose");
var userDetails = require("../models/users");

var generic = require("../routes/genericFunctions");

var CT = require("../public/modules/country-list");
var UD = require("../public/modules/userDetails");
var AM = require("../public/modules/account-manager");
//var EM = require('./modules/email-dispatcher');

var loginController = {};

// ****************AREA - START****************
// Create area
loginController.home = function (req, res) {
    if (req.cookies.login == undefined) {
        res.render('../views/login', { title: 'Hello - Please Login To Your Account' });
    } else {
        // attempt automatic login //
        UD.validateLoginKey(req.cookies.login, req.ip, function (e, o) {
            if (o) {
                console.log("autoLogin SKS + " + o + "cookies SKS + " + req.cookies.login + "ip SKS + " + req.ip);
                var userName = o.name;
                UD.autoLogin(o.user, o.pass, function (o) {
                    req.session.user = o;
                    console.log("LC Home: " + userName);
                    //res.render("../views/home?user=", { user: userName });
                    res.redirect('../home?user=' + userName);
                });
            } else {
                console.log("autoLogin Else");
                res.render('../views/login', { title: 'Hello - Please Login To Your Account' });
            }
        });
    }    
};

loginController.signIn = function (req, res) {
    UD.manualLogin(req.body['user'], req.body['pass'], function (e, o) {
        if (!o) {
            res.status(400).send(e);
        } else {
            //console.log(o);
            req.session.user = o;  //SKS: 25June19: Commented as this is creating issue...need to check later
            if (req.body['remember-me'] == 'false') {
                res.status(200).send(o);
            } else {
                UD.generateLoginKey(o.user, req.ip, function (key) {
                    res.cookie('login', key, { maxAge: 900000 });
                    res.status(200).send(o);
                });
            }
        }
    });
};

loginController.logout = function (req, res) {
    res.clearCookie('login');    
    req.session.destroy(function (e) { res.redirect('/'); });        
};

/*

loginController.post('/', function (req, res) {
    AM.manualLogin(req.body['user'], req.body['pass'], function (e, o) {
        if (!o) {
            res.status(400).send(e);
        } else {
            req.session.user = o;
            if (req.body['remember-me'] == 'false') {
                res.status(200).send(o);
            } else {
                AM.generateLoginKey(o.user, req.ip, function (key) {
                    res.cookie('login', key, { maxAge: 900000 });
                    res.status(200).send(o);
                });
            }
        }
    });
});



/*
	control panel
*/
/*
loginController.get('/home', function (req, res) {
    if (req.session.user == null) {
        res.redirect('/');
    } else {
        res.render('home', {
            title: 'Control Panel',
            countries: CT,
            udata: req.session.user
        });
    }
});

loginController.post('/home', function (req, res) {
    if (req.session.user == null) {
        res.redirect('/');
    } else {
        AM.updateAccount({
            id: req.session.user._id,
            name: req.body['name'],
            email: req.body['email'],
            pass: req.body['pass'],
            country: req.body['country']
        }, function (e, o) {
            if (e) {
                res.status(400).send('error-updating-account');
            } else {
                req.session.user = o.value;
                res.status(200).send('ok');
            }
        });
    }
});

/*
	new accounts
*/

loginController.signup = function (req, res) {
    //res.render('signup', { title: 'Signup', countries: CT });
    res.render('signup', { countries: CT });
};

loginController.signupSave = function (req, res) {
    //console.log(res.params.name);
    var ABC = new userDetails(req.body);
    console.log("signUpSave" + ABC);
    UD.addNewAccount({
        name: req.body['name'],
        email: req.body['email'],
        user: req.body['user'],
        pass: req.body['pass'],
        country: req.body['country']
    }, function (e) {
        if (e) {
            res.status(400).send(e);
        } else {
            res.status(200).send('ok');
        }
    });
};

/*
	password reset
*/
/*
loginController.post('/lost-password', function (req, res) {
    let email = req.body['email'];
    AM.generatePasswordKey(email, req.ip, function (e, account) {
        if (e) {
            res.status(400).send(e);
        } else {
            EM.dispatchResetPasswordLink(account, function (e, m) {
                // TODO this callback takes a moment to return, add a loader to give user feedback //
                if (!e) {
                    res.status(200).send('ok');
                } else {
                    for (k in e) console.log('ERROR : ', k, e[k]);
                    res.status(400).send('unable to dispatch password reset');
                }
            });
        }
    });
});

loginController.get('/reset-password', function (req, res) {
    AM.validatePasswordKey(req.query['key'], req.ip, function (e, o) {
        if (e || o == null) {
            res.redirect('/');
        } else {
            req.session.passKey = req.query['key'];
            res.render('reset', { title: 'Reset Password' });
        }
    })
});

loginController.post('/reset-password', function (req, res) {
    let newPass = req.body['pass'];
    let passKey = req.session.passKey;
    // destory the session immediately after retrieving the stored passkey //
    req.session.destroy();
    AM.updatePassword(passKey, newPass, function (e, o) {
        if (o) {
            res.status(200).send('ok');
        } else {
            res.status(400).send('unable to update password');
        }
    })
});

/*
	view, delete & reset accounts
*/
/*
loginController.get('/print', function (req, res) {
    AM.getAllRecords(function (e, accounts) {
        res.render('print', { title: 'Account List', accts: accounts });
    })
});

loginController.post('/delete', function (req, res) {
    AM.deleteAccount(req.session.user._id, function (e, obj) {
        if (!e) {
            res.clearCookie('login');
            req.session.destroy(function (e) { res.status(200).send('ok'); });
        } else {
            res.status(400).send('record not found');
        }
    });
});

loginController.get('/reset', function (req, res) {
    AM.deleteAllAccounts(function () {
        res.redirect('/print');
    });
});

loginController.get('*', function (req, res) { res.render('404', { title: 'Page Not Found' }); });
*/

/*

function LoginController()
{
// bind event listeners to button clicks //
	$('#retrieve-password-submit').click(function(){ $('#get-credentials-form').submit();});
	$('#login #forgot-password').click(function(){ 
		$('#cancel').html('Cancel');
		$('#retrieve-password-submit').show();
		$('#get-credentials').modal('show');
	});
	$('#login .button-rememember-me').click(function(e) {
		var span = $(this).find('span');
		if (span.hasClass('glyphicon-unchecked')){
			span.addClass('glyphicon-ok');
			span.removeClass('glyphicon-unchecked');
		}	else{
			span.removeClass('glyphicon-ok');
			span.addClass('glyphicon-unchecked');
		}
	});

// automatically toggle focus between the email modal window and the login form //
	$('#get-credentials').on('shown.bs.modal', function(){ $('#email-tf').focus(); });
	$('#get-credentials').on('hidden.bs.modal', function(){ $('#user-tf').focus(); });
}

*/

module.exports = loginController;