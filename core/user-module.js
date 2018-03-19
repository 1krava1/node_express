var mongoose = require('mongoose');
var http = require('http');
var axios = require('axios');

UserModule = function() {
    this.init();
}
UserModule.prototype = {
    mongoose: null,
    mongooseUrl: 'mongodb://localhost:27017',
    db: null,

    userSchema: null,
    User: null,

    init: function() {
        this.mongooseSetConnection();
        this.setUserSchema();
    },

    mongooseSetConnection: function() {
        this.mongoose = mongoose;
        this.mongoose.connect(this.mongooseUrl);
        this.db = mongoose.connection;

        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function() {
          // we're connected!
        });
    },
    setUserSchema: function() {
        this.userSchema = this.mongoose.Schema({
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
        try{
            this.User = this.mongoose.model( 'User', this.userSchema );
        } catch (err) {
            console.log(err);
        }
    },
    saveNewUser: function( data ) {
        var defaults = {
            login: '',
            password: '',
            email: '',
            steamID: '',
            firstName: '',
            lastName: '',
            avatar: '',
            registrationIP: '',
            registrationDate: Date.now(),
            lastLoginIP: '',
            lastLoginDate: Date.now(),
        };
        var userData = Object.assign( {}, defaults, data );
        var newUser = new this.User( userData );

        newUser.save(function (err, newUser) {
            if (err) return console.error(err);
            console.log(newUser);
        });
    },
    getUserIP( req ) {
        with(req) return (headers['x-forwarded-for'] || '').split(',')[0] || connection.remoteAddress;
    },
    getUserFromSteam( steamID ) {
        return axios.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?key=12A6DC55C197F422226960E2CC4AFDB6&steamids=' + steamID);
    },

    getUsers: function() {
        return this.User.find(function(err, users) {
            if (err) return console.log(err);
            console.log('users', users);
        });
    },
}
