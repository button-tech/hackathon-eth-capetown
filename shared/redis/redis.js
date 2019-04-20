const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

function getData(key) {
    return getAsync(key)
}

function setData(key, value, keyLifetime = 999999999999999) {
    return client.set(key, value, 'EX', keyLifetime);
}

function deleteData(key) {
    return client.del(key);
}

module.exports = {
  setData: setData,
  getData: getData,
  deleteData: deleteData
};