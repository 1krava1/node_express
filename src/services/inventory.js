var axios = require('axios');
var InventoryModel = require('../models/inventory');
var steamUserInventory = require('steam-user-inventory');

class InventoryService {
    constructor() {
        this.apps = {
            dota: 570,
            csgo: 730,
            pubg: 578080
        }
    }
    
    getInventory(req, res, next) {
        // res.send(InventoryModel.getInventoryFromRedis(req.params.steamID, this.apps[req.params.game]));
        this.getSteamUserInventory(req.params.steamID, "" + this.apps[req.params.game] + "/2/").then((response) => {
            res.send(this.normalizeInventory(response.data));
        });
    }

    getSteamUserInventory(user, game){
        return axios.get("http://steamcommunity.com/inventory/" + user + "/" + game + "/2?l=english&count=5000");
    }

    normalizeInventory(inventory) {
        var normalizedInventory = [];

        inventory.descriptions.forEach((item, index, array) => {
            var data = {
                id: inventory.assets[index].id,
                amount: inventory.assets[index].amount,
                pos: inventory.assets[index].pos,
                name: item.name,
                marketHashName: item.market_hash_name,
                appid: item.appid,
                classid: item.classid,
                instanceid: item.instanceid,
                tradable: item.tradable,
                marketable: item.marketable,
                marketTradableRestriction: item.market_tradable_restriction,
                link: item.actions ? item.actions[0].link : null,
                image: `http://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large || item.icon_url}`,
                category: null,
                type: null,
                exterior: null,
                quality: null,
                raw: item,
            };
            
            item.tags.forEach(tag => {
                if (tag.category === 'Type') {
                    data.type = tag.name;
                }
                if (tag.category === 'Weapon') {
                    data.weapon = tag.name;
                }
                if (tag.category === 'Quality') {
                    data.category = tag.name;
                }
                if (tag.category === 'Exterior') {
                    data.exterior = tag.name;
                }
            });

            normalizedInventory.push(data);
        });
        return normalizedInventory;
    }
}

module.exports = new InventoryService();