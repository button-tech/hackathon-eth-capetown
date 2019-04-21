const db = require('../../shared/db/db');
const Text = require('../../shared/text');
const redis = require('../../shared/redis/redis');
const telegram = require('../../shared/messangers/telegram');
const Keyboard = require('../../shared/keyboard/keyboard');
const rp = require('request-promise');
const guid = require('guid');

async function createAccount(req, res) {
    const id = req.params.guid;
    const {ethereumAddress} = req.body;

    redis.getData(id)
        .then(async value => {
            const options = {
                method: 'GET',
                uri: `https://capetown.buttonwallet.com/airdrop/send/${ethereumAddress}`,
                json: true
            };
            console.log(await rp(options));

            value = JSON.parse(value);
            await db.user.create(value.userID, value.nickname, ethereumAddress);
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
                telegram.sendMessage(value.fromUserID, Keyboard.start, `✅ Successfully sent ${value.amount} ${value.currency} ${value.toNickname ? "to @" + value.toNickname : ""}.\n`);

            } catch (e) {
                console.log(e)
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

async function getDataByGuid(req, res) {
    const id = req.params.guid;
    redis.getData(id)
        .then(value => {
            if (value != null) {
                let val = JSON.parse(value);
                res.send({
                    error: null,
                    result: val
                });
            } else
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
    const key = req.params.guid;
    const friends = JSON.parse(await redis.getData(key));

    const senderNickname = friends["me"]["nickname"];
    console.log("senderNickname=", senderNickname);
    for (let key in friends) {
        if (key === "me")
            continue;

        const text = `Hello, your friend @${senderNickname} needs your help if he will loose QR`;
        await telegram.sendMessageWithoutKeyboard(friends[key].userId, text);
    }

    await db.user.update.registred(friends.me.userId);
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

async function recordWalletAddress(req, res) {
    const {guid, walletAddress} = req.params;

    redis.getData(guid)
        .then(async (strValue) => {

            const value = JSON.parse(strValue);
            await db.user.update.setWalletAddress(value.me.userId, walletAddress);

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

async function createNewAccount(req, res) {
    const id = req.params.guid;
    const {ethereumAddress} = req.body;

    redis.getData(id)
        .then(async value => {

            value = JSON.parse(value);

            await db.user.update.setRecoveryAddress(value.userID, ethereumAddress);

            const user = await db.user.find.oneByID(value.userID);

            for (let i = 0; i < user.friendsForRestore.length; i++) {

                const key = guid.create().value;

                const friend = await db.user.find.oneByID(user.friendsForRestore[i]);

                const newValue = JSON.stringify({
                    walletAddress: user.walletAddress,
                    newAddress: ethereumAddress,
                    helperId: friend.userID,
                    helperNickname: friend.nickname,
                    helperAddress: friend.ethereumAddress,
                    troubleUserId: user.userID,
                    troubleUserNickname: user.nickname,
                    troubleUserAddress: user.ethereumAddress,
                    lifetime: Date.now() + (600 * 1000),
                });

                redis.setData(key, newValue, (600 * 1000));

                console.log(Text.inline_keyboard.save_money["2"].callback+key);

                const res = await telegram.sendInlineButton(user.friendsForRestore[i],
                    `Your friend @${user.nickname} lost hit QR. Pls help him restore it`, "Help",
                    Text.inline_keyboard.save_money["2"].callback+key);
                console.log(res)
            }

            redis.deleteData(id);
            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e,
                result: null
            });
        })
}

async function getSignatures(req, res) {
    //const id = req.params.guid;
    const id = req.params[Object.keys(req.params)[0]];

    redis.getData(id)
        .then(async value => {
            value = JSON.parse(value);
            const troubleUser = await db.user.find.oneByID(value.troubleUserId);
            res.send({
                error: null,
                result: troubleUser.friendsSignatures
            });

        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        });
}

function recordSignature(req, res) {
    const id = req.params.guid;
    const {r, s, v} = req.body;

    redis.getData(id)
        .then(async value => {

            value = JSON.parse(value);

            await db.user.update.signatures(value.troubleUserId, r, s, v);

            let troubleUser = await db.user.find.oneByID(value.troubleUserId);
            telegram.sendMessageWithoutKeyboard(value.troubleUserId, `You supported by @${value.helperNickname}!`);

            if (troubleUser.friendsSignatures.r.length === 3) {

                await telegram.sendInlineButtonCallbackType(value.troubleUserId,
                    `You supported by all your friends. Now you can use your new QR Code`, "ok",
                    `MainMenu`);

                await db.user.update.setAddress(value.troubleUserId,troubleUser.recoveryAddress);
                await db.user.update.changeSRV(value.troubleUserId);

                const options = {
                    method: 'GET',
                    uri: `https://capetown.buttonwallet.com/airdrop/send/${troubleUser.recoveryAddress}`,
                    json: true
                };
                console.log(await rp(options));


                res.send({
                    error: null,
                    result: 'success'
                });
            }

        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}

module.exports = {
    createAccount: createAccount,
    createTransaction: createTransaction,
    getGuidLifetime: getGuidLifetime,
    getDataByGuid: getDataByGuid,
    register: register,
    createNewAccount: createNewAccount,
    recover: recover,
    recordSignature: recordSignature,
    recordWalletAddress: recordWalletAddress,
    getSignatures: getSignatures
};
