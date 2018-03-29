var redis = require('../databases/redis');

class InventoryModel {
    constructor(){}

    setInventoryToRedis(steamid, gameid, inventory){
        const redisKey = 'inventory.' + steamid + '.' + gameid;
        return new Promise((resolve, reject) => {
            redis.set(redisKey, inventory, (err, reply) => {              
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

    setPricesToRedis( gameid, items ) {
        // items = [ 'key1', 'value1', 'key2', 'value2', ... ]
        return new Promise((resolve, reject) => {
            redis.client.hmset('prices.' + gameid, items, function (err, res) {
                redis.client.expire('prices.' + gameid, 60 * 10);
            });
        });
    }
    getPricesFromRedis( gameid, items ) {
        // items = [ 'key1', 'key2', ... ]
        return new Promise((resolve, reject) => {
            if ( !!items ) {
                redis.client.hmget('prices.' + gameid, items, (err, reply) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(reply);
                });
            } else {
                redis.client.hgetall('prices.' + gamdeid, (err, reply) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(reply);
                });
            }
        });
    }
    isPricesExists( gameid ) {
        return new Promise ((resolve) => redis.client.keys('prices.' + gameid, (err, rep) => {
            resolve( !!rep.length );
        }));
    }
}
module.exports = new InventoryModel();
