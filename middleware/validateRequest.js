var jwt = require('jwt-simple');
var validateUser = require('../services/auth.service').validateUser;

module.exports = (req, res, next) => {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (!token) {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token"
        });
        return;
    }
    try {
        var decoded = jwt.decode(token, require('../config').secret());
        if (decoded.exp <= Date.now()) {
            res.status(400);
            res.json({
                "status": 400,
                "message": "Token Expired"
            });
            return;
        }
        validateUser(decoded.user_id, _handle);
        function _handle(dbUser) {
            if (dbUser) {
                if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'administrator') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
                    req.user = dbUser;
                    next();
                } else {
                    res.status(403);
                    res.json({
                        "status": 403,
                        "message": "Not Authorized"
                    });
                    return;
                }
            } else {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid User"
                });
                return;
            }
        }
    } catch (err) {
        res.status(500);
        res.json({
            "status": 500,
            "message": "Oops something went wrong",
            "error": err
        });
    }
};
