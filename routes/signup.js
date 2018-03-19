var express = require('express');
var router = express.Router();
require('../core/user-module');
var userModule = new UserModule();

/* POST signup. */
router.post('/', function(req, res, next) {
  var newUserData = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password,
    registrationIP: userModule.getUserIP(req),
    lastLoginIP: userModule.getUserIP(req),
  }
  userModule.saveNewUser(newUserData);
  res.render('signup', {
                  title: 'Express SignUp',
                  login: req.body.login,
                  email: req.body.email,
                  password: req.body.password
              });
});

router.get('/auth', function(req, res, next) {
  var steamID = req.query['openid.identity'].split('/')[req.query['openid.identity'].split('/').length - 1];
  userModule.getUserFromSteam(steamID).then(response => {
    var player = response.data.response.players[0];
    var data = {
      login: player.personaname,
      password: '',
      email: '',
      steamID: player.steamid,
      firstName: player.realname.split(' ')[0],
      lastName: player.realname.split(' ')[1],
      avatar: player.avatarfull,
      registrationIP: userModule.getUserIP(req),
      registrationDate: Date.now(),
      lastLoginIP: userModule.getUserIP(req),
      lastLoginDate: Date.now(),
    };
    userModule.saveNewUser(data);
    res.redirect('200', 'signup')
  })
});

/* GET signup. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express SignUp', users: userModule.getUsers() });
});

module.exports = router;
