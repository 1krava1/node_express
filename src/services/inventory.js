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

        // TODO: rewrite to http://steamcommunity.com/inventory/$%7Buser%7D/$%7Bgame%7D/2?l=english&count=5000 with own requests
        steamUserInventory(req.params.steamID, "" + req.params.game + "/2/").then((response) => {
            res.send(response);
        });
    }
}

module.exports = new InventoryService();