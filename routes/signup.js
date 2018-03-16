var express = require('express');
var router = express.Router();
require('../core/user-module');
var userModule = new UserModule();

/* POST signup. */
router.post('/', function(req, res, next) {
  var newUserData = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  }
  userModule.saveNewUser(newUserData);
  res.render('signup', {
                  title: 'Express SignUp',
                  login: req.body.login,
                  email: req.body.email,
                  password: req.body.password
              });
});

/* GET signup. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express SignUp', users: userModule.getUsers() });
});

module.exports = router;
