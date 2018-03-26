var redis = require('../databases/redis');
const {promisify} = require('util');

class InventoryModel {
    constructor(){}

    setInventoryToRedis(steamid, gameid, inventory){
        const redisKey = 'inventory.' + steamid + '.' + gameid;
        return new Promise((resolve, reject) => {
            redis.client.set(redisKey, inventory, (err, reply) => {
              if (err) {
                return reject(err);
              }
              resolve(reply);
            });
        });
    }

    getInventoryFromRedis(steamid, gameid){
        const redisKey = 'inventory.' + steamid + '.' + gameid;
        return new Promise((resolve, reject) => {
            redis.client.get(redisKey, (err, reply) => {
              if (err) {
                return reject(err);
              }
              resolve(reply);
            });
        });
    }

    isInventoryExists( steamid, gameid ){
        return new Promise ((resolve) => redis.client.keys('inventory.' + steamid + '.' + gameid, (err, rep) => {
            resolve( !!rep.length );
        }));
    }
}
module.exports = new InventoryModel();
