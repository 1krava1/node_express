var redis = require('../databases/redis');

class InventoryModel {
    constructor(){}

    setInventoryToRedis(steamid, inventory){
        return redis.set('inventory.' + steamid, inventory);
    }

    getInventoryFromRedis(steamid, gameid){
        return redis.get('inventory.' + steamid + '.' + gameid);
    }
}
module.exports = new InventoryModel();
