var mongoose = require('mongoose');
var http = require('http');
var axios = require('axios');
var UserModel = require('../models/user');

class UserService {
    constructor(){}
    saveNewUser(req, res, next) {
        var steamID = req.query['openid.identity'].split('/')[req.query['openid.identity'].split('/').length - 1];
        this.getUser( {steamID: steamID} ).then(user => {
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
                });
            }
        });
        res.redirect('http://localhost:4200');
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
    getUser( data ) {
        return UserModel.getUser( data );
    }
    getUsers( data ) {
        return UserModel.getUsers( data );
    }
}
module.exports = new UserService();
