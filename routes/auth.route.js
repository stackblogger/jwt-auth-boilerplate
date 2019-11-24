var express = require('express');
var router = express.Router();

var authService = require('../services/auth.service');

router.post('/register', authService.register);
router.post('/login', authService.login);
router.get('/logout', authService.logout);

module.exports = router;
