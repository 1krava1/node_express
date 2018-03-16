var express = require('express');
var router = express.Router();

/* POST signup. */
router.post('/', function(req, res, next) {
    res.render('signup', {
                    title: 'Express Signup',
                    login: req.body.login,
                    password: req.body.password
                });
});

/* GET signup. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express SignUp' });
});

module.exports = router;
