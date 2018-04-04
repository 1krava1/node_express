var mongoose = require('mongoose');
var axios = require('axios');

class TransactionModel {
    constructor( transactionSchema = null,
                 Transaction = null ){
        this.setTransactionSchema();
    }
    setTransactionSchema() {
        this.transactionSchema = mongoose.Schema({
            steamID: String,
            tradeID: String,
            paymentID: String,
            email: String,
            walletNumber: String,
            ip: String,
            dateCreated: String,
            paymentSystem: String,
        });
        try{
            this.Transaction = mongoose.model( 'Transaction', this.transactionSchema );
        } catch (err) {
            console.log(err);
        }
    };
    create( data ) {
        let transaction = new this.Transaction( data );

        transaction.save(function (err, newTransaction) {
            if (err) return console.error(err);
            console.log(newTransaction);
        });
    };
    getTransaction( data ) {
        return this.Transaction.findOne(data, (err, transactions) => {
            if (err) return console.log(err);
        });
    };
    getTransactions( data ) {
        return this.Transaction.find(function(err, transactions) {
            if (err) return console.log(err);
        });
    };
    update( data ) {
        return {'models/Transaction.update()': data};
    };
    delete( data ) {
        return {'models/Transaction.delete()': data};
    };
    authTransaction() {

    }
}

module.exports = new TransactionModel();
