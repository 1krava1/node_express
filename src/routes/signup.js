var express = require('express');
var router = express.Router();
var UserService = require('../services/user');

/* POST signup. */
router.post('/', function(req, res, next) {
  res.render('signup', {
                  title: 'Express SignUp',
                  login: req.body.login,
                  email: req.body.email,
                  password: req.body.password
              });
});

router.get('/auth', function(req, res, next) {
  UserService.saveNewUser(req, res, next);
});

/* GET signup. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express SignUp', users: UserService.getUsers() });
});

module.exports = router;
