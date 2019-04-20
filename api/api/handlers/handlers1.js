const db = require('../../shared/db/db');
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
                telegram.sendMessage(value.fromUserID, Keyboard.start, `✅ Successfully sent ${value.amount} ${value.currency} ${value.toNickname ? "to @"+value.toNickname: ""}.\n`);

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

async function createNewAccount(req, res) {
    const id = req.params.guid;
    const {ethereumAddress, walletAddress} = req.body;

    redis.getData(id)
        .then(async value => {

            value = JSON.parse(value);

            await db.user.update.setRecoveryAddress(value.userID, ethereumAddress, walletAddress);

            const user = await db.user.find.oneByID(value.userID);

            for(let i=0; i<3; i++) {

              const key = guid.create().value;

              const friend = await db.user.find.oneByID(user.friendsForRestore[i]);

              const value = JSON.stringify({
                  helperId:friend.userID,
                  helperNickname: friend.nickname,
                  helperAddress: friend.ethereumAddress,
                  troubleUserId:user.userID,
                  troubleUserNickname:user.nickname,
                  troubleUserAddress:user.ethereumAddress,
                  walletAddress: walletAddress,
                  lifetime: Date.now() + (utils.keyLifeTime * 1000),
              });

              redis.setData(key, value, value.lifetime);

              await telegram.sendInlineButton(user.friendsForRestore[i],
                    `Your friend ${user.nickname} lost hist QR. Pls help him restore it`, "Help",
                    `/restore/?restore=${key}`);
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

function recordSignature(req, res) {
    const id = req.params.guid;
    const {r,s,v} = req.body;

    redis.getData(id)
        .then(async value => {

            value = JSON.parse(value);

            let troubleUser = await db.user.find.oneByID(value.troubleUserId);

            await db.user.update.signatures(value.troubleUserId, r, s ,v);

            // telegram.sendMessageWithoutKeyboard(value.troubleUserId, `Your friend supports @${value.helperNickname}!`);

            if(troubleUser.friendsSignatures.r.length===3){
                // const key = guid.create().value;

                await telegram.sendInlineButtonCallbackType(user.friendsForRestore[i],
                    `You supported by all your friends. Now you can use your new QR Code`, "ok",
                    `MainMenu`);

                // const value = JSON.stringify({
                //     ownerAddress:troubleUser.userID,
                //     ownerNickname:troubleUser.nickname,
                //     ownerNewAddress:troubleUser.recoveryAddress,
                //     lifetime: Date.now() + (utils.keyLifeTime * 1000),
                // });

                //redis.setData(key, value, value.lifetime);

                // await telegram.sendInlineButton(troubleUser.userID,
                //     `All of your friends approved friend`, "NICE",
                //     `/moveOwner/?moveOwner=${key}`);
                
                redis.deleteData(id);
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
    recordSignature: recordSignature
};
