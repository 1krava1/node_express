var mongoose = require('mongoose');
var http = require('http');
var axios = require('axios');

class UserModel {
    constructor( userSchema = null,
                 User = null ){
        this.setUserSchema();
    }
    setUserSchema() {
        this.userSchema = mongoose.Schema({
            login: String,
            password: String,
            email: String,
            steamID: String,
            firstName: String,
            lastName: String,
            avatar: String,
            registrationIP: String,
            registrationDate: String,
            lastLoginIP: String,
            lastLoginDate: String,
        });
        try{
            this.User = mongoose.model( 'User', this.userSchema );
        } catch (err) {
            console.log(err);
        }
    };
    create( data ) {
        let user = new this.User( data );

        user.save(function (err, newUser) {
            if (err) return console.error(err);
            console.log(newUser);
        });
    };
    getUser( data ) {
        return this.User.findOne(data, (err, users) => {
            if (err) return console.log(err);
        });
    };
    getUsers( data ) {
        return this.User.find(function(err, users) {
            if (err) return console.log(err);
        });
    };
    update( data ) {
        return {'models/User.update()': data};
    };
    delete( data ) {
        return {'models/User.delete()': data};
    };
    authUser() {

    }
}

module.exports = new UserModel();
