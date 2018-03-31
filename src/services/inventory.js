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
        const steamid = req.params.steamID,
              gameid  = this.apps[req.params.game];
        InventoryModel.isInventoryExists( steamid, gameid ).then( (exists) => {
            if ( exists ) {
                InventoryModel.getInventoryFromRedis( steamid, gameid ).then((resolve) => {
                    res.send( resolve );
                })
            } else {
                this.getSteamUserInventory(req.params.steamID, "" + this.apps[req.params.game] + "/2/").then((response) => {
                    this.normalizeInventory(response.data).then((result) => {
                        InventoryModel.setInventoryToRedis( steamid, gameid, JSON.stringify(result) ).then(response => {});
                        res.send(result);
                    });
                });
            }
        });
    }
    getSteamUserInventory(user, game){
        return axios.get("http://steamcommunity.com/inventory/" + user + "/" + game + "/2?l=english&count=5000");
    }
    normalizeInventory(inventory) {
        return new Promise ((resolve, reject) => {
            const normalizedInventory = [];
            const names = [];
            let appid = 0;
    
            inventory.descriptions.forEach((item, index, array) => {
                let data = {
                    n: index,
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
                };
                
                item.tags.forEach(tag => {
                    if (tag.category === 'Type') {
                        data.type = tag.internal_name;
                    }
                    if (tag.category === 'Weapon') {
                        data.weapon = tag.internal_name;
                    }
                    if (tag.category === 'Quality') {
                        data.category = tag.internal_name;
                    }
                    if (tag.category === 'Exterior') {
                        data.exterior = tag.internal_name;
                    }
                });
    
                names.push(item.market_hash_name);
                normalizedInventory.push(data);
                appid = item.appid;
            });
            this.getPrices( appid, names ).then((response) => {
                normalizedInventory.forEach((item, index, array) => {
                    normalizedInventory[index].price = !!response[item.marketHashName] ? response[item.marketHashName] : 0;
                });
                resolve(normalizedInventory);
            });
        });
    }

    getPrices( gameid, items ) {
        return new Promise ((resolve, reject) => {
            InventoryModel.isPricesExists( gameid ).then( (exists) => {
                if ( exists ) {
                    InventoryModel.getPricesFromRedis( gameid, items ).then((response) => {
                        const prices = {};
                        items.forEach((name, index, array) => {
                            prices[name] = response[index];
                        });
                        resolve(prices);
                    });
                } else {
                    this.getOPSkinsPrices(gameid).then((response, error) => {
                        if (error) reject(error);
                        InventoryModel.getPricesFromRedis( gameid, items ).then((response) => {
                            const prices = {};
                            items.forEach((name, index, array) => {
                                prices[name] = response[index];
                            });
                            resolve(prices);
                        });
                    });
                }
            });
        });
    }
    getOPSkinsPrices( gameid ) {
        return new Promise((resolve, reject) => {
            axios.get( 'https://api.opskins.com/IPricing/GetAllLowestListPrices/v1/?appid=' + gameid ).then((response, error) => {
                if (error) reject(error);
                InventoryModel.setPricesToRedis( gameid, this.normalizePrices(response.data.response) ).then((response) => {
                    resolve(response);
                });
            })
        });
    }
    normalizePrices( items ) {
        const normalizedPrices = [];
        Object.keys( items ).forEach((value, index, array) => {
            normalizedPrices.push(value);
            normalizedPrices.push(items[value].price);
        });
        return normalizedPrices;
    }
}

module.exports = new InventoryService();