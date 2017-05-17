const mongo = require('mongodb').MongoClient
const zenodb = require('./zenodb');
const redirect = require('micro-redirect');
const next = require('next');
const app = next({ dev: false });
const handle = app.getRequestHandler();

const goodUrlPattern = new RegExp('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})');

// Handle insertion of a new url entry into the database
const insertNew = (url, res, host) => {
  let database = null;
  let collection = null;
  zenodb.open()
    .then((db)=>{
        database = db;
        return db.collection('urls')
    })
    .then(urls => {
      // Get last inserted row so we can increment id
      collection = urls;
      return urls.find().sort({"_id":-1}).limit(1).toArray()
    })
    .then(lastResult => {
      // Compute a new id
      const lastIdRadix = lastResult.length > 0 ? lastResult[0]['_id'] : '9cdf';
      const lastId = parseInt(lastIdRadix, 36)
      // Persist row with new id and the url
      return collection.insert({ url, _id:(lastId+31).toString(36) })
    })
    .then(result => {
        res.end(JSON.stringify({originalUrl: url, shortenUrl: `https://${host}/${result.ops[0]._id}`}))
        database.close();
    })
    .catch(err =>{
        console.error(err);
        res.end(JSON.stringify(err));
    })
};

// Fetch url for the given shortened url and apply redirection
const processShortenPath = (_id, res) => {
  let database = null;
  let collection = null;
  zenodb.open()
    .then((db)=>{
        database = db;
        return db.collection('urls')
    })
    .then(urls => {
      return urls.find({_id: _id}).limit(1).toArray()
    })
    .then(lastResult => {
      if (lastResult.length === 0) {
        res.end(JSON.stringify({error: "Url not in database"}));
      } else {
        redirect(res, 302, lastResult[0].url)
      }
      database.close();
    })
    .catch(err =>{
        console.error(err);
        res.end(JSON.stringify(err));
    })
};

module.exports = (req, res) => {
  if (req.url === '/' || req.url === '') {
    return handle(req, res); //app.render(req, res, '/index', req.query)
  }

  const newRequestMatch = req.url.match(/\/new\/(.*)/);
  if (newRequestMatch) {
    const url = newRequestMatch[1];
    if (url && goodUrlPattern.test(url)) {
      insertNew(url, res, req.headers.host);
    } else {
      return JSON.stringify({err:"bad url"});
    }
  } else {
    processShortenPath(req.url.substring(1), res);
  }

}
