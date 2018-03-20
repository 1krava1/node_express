var express = require('express');
var router = express.Router();
var UserService = require('../services/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  UserService.getUsers().then((data) => {
    res.send(data);
  })
});

module.exports = router;
