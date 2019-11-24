var express = require('express');
var router = express.Router();

var indexService = require('../services/index.service');

router.get('/me', indexService.me);

module.exports = router;
