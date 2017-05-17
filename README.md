# timestamp-api
freecodecamp url-shortener-microservice api

[Demo](https://url-shortener-microservice-ovzvootaff.now.sh)

Setup


Get a free MongoDB on [https://mlab.com](https://mlab.com) and create a new DB with a collection named urls.

Then

```
npm install
npm run build
touch mongoConfig.js
```

Put your own credentials into `now.json`
```
{
  "env": {
    "MONGODB_URI": "mongodb://$user:$password@$databaseId.mlab.com:41401/$dbName"
  }
}
```
