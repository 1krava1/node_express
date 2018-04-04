var mongoose = require('mongoose');
var axios = require('axios');

class TradeModel {
    constructor( tradeSchema = null,
                 Trade = null ){
        this.setTradeSchema();
    }
    setTradeSchema() {
        this.tradeSchema = mongoose.Schema({
            tradeID: String,
            botID: String,
            appID: Number,
            items: [{
                n: Number,
                amount: String,
                name: String,
                marketHashName: String,
                appid: Number,
                classid: String,
                instanceid: String,
                tradable: Number,
                marketable: Number,
                marketTradableRestriction: Number,
                link: String,
                image: String,
                category: String,
                type: String,
                exterior: String,
                quality: String,
                price: String
            }],
            status: Number,
            createdAt: Number,
            completedAt: Number,
        });
        try{
            this.Trade = mongoose.model( 'Trade', this.tradeSchema );
        } catch (err) {
            console.log(err);
        }
    };
    create( data ) {
        let trade = new this.Trade( data );

        trade.save(function (err, newTrade) {
            if (err) return console.error(err);
            console.log(newTrade);
        });
    };
    getTrade( data ) {
        return this.Trade.findOne(data, (err, trades) => {
            if (err) return console.log(err);
        });
    };
    getTrades( data ) {
        return this.Trade.find(function(err, trades) {
            if (err) return console.log(err);
        });
    };
    update( data ) {
        return {'models/Trade.update()': data};
    };
    delete( data ) {
        return {'models/Trade.delete()': data};
    };
    authTrade() {

    }
}

module.exports = new TradeModel();
