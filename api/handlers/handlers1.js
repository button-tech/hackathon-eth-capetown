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

async function createTransaction(req, res) {
    const id = req.params.guid;
    const txHash = req.body.txHash;

    redis.getData(id)
        .then(async value => {
            value = JSON.parse(value);
            await db.transaction.create(value.currency, value.fromUserID, value.toUserID, value.toAddress, value.amount, value.amountInUSD, txHash);
            const userFrom = await db.user.find.oneByID(value.fromUserID);
            try {
                const msg = `*${userFrom.nickname}* send you ${value.amount} ${value.currency}`;
                if (value.toUserID) {
                    telegram.sendMessage(value.toUserID, Keyboard.start, msg);
                }
                telegram.sendMessage(value.fromUserID, Keyboard.start, `✅ Successfully sent ${value.amount} ${value.currency} ${value.toNickname ? "to @"+value.toNickname: ""}.\n`);

            } catch (e) {

            }

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

async function getDataByGuid(req,res) {
    const id = req.params.guid;
    redis.getData(id)
        .then(value => {
            if (value != null) {
                let val = JSON.parse(value);
                res.send({
                    error: null,
                    result: val
                });
            }
            else
                res.send({
                    error: 'Deleted',
                    result: null
                });
        })
        .catch(e => {
            console.log(e);
            res.send({
                error: e.message,
                result: null
            });
        });
}

async function getGuidLifetime(req, res) {
    const id = req.params.guid;

    redis.getData(id)
        .then(value => {
            res.send({
                error: null,
                result: JSON.parse(value).lifetime
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        });
}

async function register(req, res) {
    const key = res.param.guid;
    const friends = await redis.getData(key);
    const senderNickname = friends.me.nickname;
    for (let i in friends) {
        if (friends[i] === "me")
            await telegram.sendInlineButtonCallbackType(friends[i].userID,
                `Hello, your friend @${senderNickname} needs your help if he will loose QR`, "Got it!",
                `MainMenu`);
    }
    await db.user.update.registred(friends.me.userID);
    redis.deleteData(key);
    res.send({
        error: null,
        result: 'success'
    });
}

async function recover(req, res) {
    // for (let i = 0; i < friends.length; i++) {
    //     const key = guid.create().value;
    //     const value = JSON.stringify({
    //         fromAddress: sender.ethereumAddress,
    //         toAddress: friends[i].ethereumAddress,
    //         fromNickname: sender.nickname,
    //         toNickname: friends[i].nickname,
    //         lifetime: Date.now() + (utils.keyLifeTime * 1000),
    //     });
    // }
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
