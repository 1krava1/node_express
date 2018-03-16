var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userSchema = mongoose.Schema({
    login: String,
    password: String,
    email: String,
    steamID: Number,
    firstName: String,
    lastName: String,
    avatar: String,
    registrationIP: String,
    registrationDate: String,
    lastLoginIP: String,
    lastLoginDate: String,
});

var User = mongoose.model( 'User', userSchema );

var nick = new User({
    login: 'krava',
    password: 'password',
    email: 'krava9519@gmail.com',
    steamID: '123456',
    firstName: 'Nick',
    lastName: 'Kravchenko',
    avatar: 'https://facebook.com',
    registrationIP: '127.0.0.1',
    registrationDate: 123456789,
    lastLoginIP: '127.0.0.1',
    lastLoginDate: 2123564841,
});
// nick.save(function (err, nick) {
//     if (err) return console.error(err);
//     console.log(nick);
// });

