var mongoose = require('mongoose');
var axios = require('axios');
var UserModel = require('../models/user');
var JsonWebTokenAuth = require('../models/jwt_auth');

class UserService {
    constructor(){}
    saveNewUser(req, res, next) {
        var steamID = req.query['openid.identity'].split('/')[req.query['openid.identity'].split('/').length - 1];
        this.getUserFromDB( {steamID: steamID} ).then(user => {
            if ( !user ) {
                this.getUserFromSteam(steamID).then(response => {
                    var player = response.data.response.players[0];
                    var data = {
                        login: player.personaname,
                        password: '',
                        email: '',
                        steamID: player.steamid,
                        firstName: player.realname.split(' ')[0],
                        lastName: player.realname.split(' ')[1],
                        avatar: player.avatarfull,
                        registrationIP: this.getUserIP(req),
                        registrationDate: Date.now(),
                        lastLoginIP: this.getUserIP(req),
                        lastLoginDate: Date.now(),
                    };
                    UserModel.create( data );
                    this.getUserFromDB( {steamID: steamID} ).then(user => {
                        res.redirect('http://localhost:4200/signup/' + JsonWebTokenAuth.createJWToken({sessionData: user, maxAge: 3600}));
                    });                    
                });
            } else {
                res.redirect('http://localhost:4200/signup/' + JsonWebTokenAuth.createJWToken({sessionData: user, maxAge: 3600}));
            }
        });
    }
    getUserIP(req) {
        return req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null);
    }
    getUserFromSteam( steamID ) {
        return axios.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002?key=12A6DC55C197F422226960E2CC4AFDB6&steamids=' + steamID);
    }
    getUserFromDB( data ) {
        return UserModel.getUser( data );
    }
    getUsers( data ) {
        return UserModel.getUsers( data );
    }
    goToSteam(req, res, next) {
        res.redirect('https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=http://localhost:3000/signup/auth/&openid.realm=http://localhost:3000&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select');
    }
}
module.exports = new UserService();
