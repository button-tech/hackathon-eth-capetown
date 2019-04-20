const db = require('../../shared/db/db');
const redis = require('../../shared/redis/redis');
const telegram = require('../../shared/messangers/telegram');
const Keyboard = require('../../shared/keyboard/keyboard');


async function createAccount(req, res) {
    const id = req.params.guid;
    const ethereumAddress = req.body.ethereumAddress;
    const bitcoinAddress = req.body.bitcoinAddress;

    redis.getData(id)
        .then(async value => {
            value = JSON.parse(value);
            await db.user.create(value.userID, value.nickname, ethereumAddress, bitcoinAddress);
            telegram.sendMessage(value.userID, Keyboard.start, 'ℹ️ Main menu');
            redis.deleteData(id);
            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}


function createNewAccount(req, res) {

}

function recordSignature(req, res) {

}


module.exports = {
    createAccount: createAccount,
    createTransaction: createTransaction,
    getGuidLifetime: getGuidLifetime,
    getDataByGuid: getDataByGuid,
    register: register,
    createNewAccount: createNewAccount,
    recover: recover,
    recordSignature: recordSignature
};
