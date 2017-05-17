const MONGODB_URI = process.env.MONGODB_URI || require('./now.json').env.MONGODB_URI;
const mongoClient = require('mongodb').MongoClient;

const open = () => {
    // Connection URL. This is where your mongodb server is running.
    let url = MONGODB_URI;
    return new Promise((resolve, reject) => {
        // Use connect method to connect to the Server
        mongoClient.connect(url, (err, db) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

const close = (db) => {
    //Close connection
    if(db){
        db.close();
    }
}

let db = {
    open : open,
    close: close
}

module.exports = db;
