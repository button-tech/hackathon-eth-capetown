const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

function getData(key) {
    return getAsync(key)
}


module.exports = {
  setData: setData,
  getData: getData,
  deleteData: deleteData
};