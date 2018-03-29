var redis = require('redis');

class Redis {
    constructor(){
        this.open();
    }

    open(){
        const client = this.client = redis.createClient({expire: 10*60});
    }

    set( key, value ){
        return this.client.set([key, value, 'NX', 'EX', 10*60], function(err, reply) {console.log(reply)})
    }

    get( key ){
        return this.client.get(key);
    }

    close(){
        this.client.quit();
    }
}
module.exports = new Redis();
