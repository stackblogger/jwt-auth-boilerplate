var service = {};

service.me = (req, res, next) => {
    return res.json(req.user);
}

module.exports = service;