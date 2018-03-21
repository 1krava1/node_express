var express = require('express');
var router = express.Router();
var UserService = require('../services/user');

router.get('/auth', function(req, res, next) {
  UserService.saveNewUser(req, res, next);
});

/* GET signup. */
router.get('/', function(req, res, next) {
  UserService.goToSteam(req, res, next);
});

module.exports = router;
