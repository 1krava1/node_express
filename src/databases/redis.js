var redis = require('redis');

class Redis {
    constructor(){
        this.open();
    }

    open(){
        const client = this.client = redis.createClient();
            client.keys('*', (err, keys) => {
                console.log(keys);
            });
    }

    set( key, value ){
        return this.client.set(key, value, 'EX', 36000);
    }

    get( key ){
        return this.client.get(key);
    }

    close(){
        this.client.quit();
    }
}
module.exports = new Redis();
