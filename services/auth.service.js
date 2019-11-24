var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var crypto = require('crypto');

var configVar = require('../config');
var User = require('../models/user.model');

var service = {};

service.register = (req, res, next) => {
    var firstname = req.body.firstname || "";
    var lastname = req.body.lastname || "";
    var email = req.body.email || "";
    var password = req.body.password || "";

    if (email == "" || password == "") {
        res.status(400);
        res.json({
            "status": 400,
            "message": "email or password was not provided"
        });
        return;
    }

    service.userExist(email, _handle);

    function _handle(err, user) {
        if (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Something went wrong at server"
            });
            return;
        }

        if (user) {
            res.status(409);
            res.json({
                "status": 409,
                "message": "User already exist with this email"
            });
            return;
        }

        var userCollection = new User({
            'email': email,
            'password': new User().generateHash(password),
            'firstname': firstname,
            'lastname': lastname
        })

        userCollection.save(_saveUser);

        function _saveUser(err, user) {
            if (err && err.code == 11000) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Duplicate username"
                });
                return;
            }
            if (err) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Something went wrong at server"
                });
                return;
            }

            res.json(genToken(user));
        }
    }
}

service.login = (req, res, next) => {
    var email = req.body.email || '';
    var password = req.body.password || '';
    if (email == '') {
        res.status(400);
        res.json({
            "status": 400,
            "message": "email was not provided"
        });
        return;
    }
    if (password == '') {
        res.status(400);
        res.json({
            "status": 400,
            "message": "password was not provided"
        });
        return;
    }
    service.validate(email, password, function (dbUserObj) {
        if (!dbUserObj) {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
        res.json(genToken(dbUserObj));
    });
}

service.logout = (req, res, next) => {

}

service.validate = (email, password, done) => {
    User.findOne({
        "email": {
            "$regex": "^" + email.toLowerCase() + "\\b", "$options": "i"
        }
    }, _handleCallback);

    function _handleCallback(err, doc) {
        if (typeof doc == 'undefined' || doc == null) return done(null);

        var result = doc.validPassword(password);

        return result ? done(doc) : done(null);
    }
}

service.userExist = (email, callback) => {
    User.findOne({
        'email': email
    }, callback);
}

service.validateUser = (userId, done) => {
    User.findOne({
        _id: userId
    }, _handleUserDb);

    function _handleUserDb(err, doc) {
        if (err) {
            return done(null);
        }

        if (!doc) {
            return done(null);
        }

        if (typeof doc == 'undefined') return done(null);

        return done(doc);
    }
}

module.exports = service;

function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        user_id: user._id
    }, configVar.secret());

    return {
        token: token,
        expires: expires,
        user_id: user._id
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

