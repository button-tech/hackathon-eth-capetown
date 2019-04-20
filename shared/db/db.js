require('./db.connector');
const User = require('./schema/user');
const Transaction = require('./schema/transaction');

const user = {
    create: async (userID, nickname, ethereumAddress, bitcoinAddress) => User.create({
        userID: userID,
        nickname: nickname,
        ethereumAddress: ethereumAddress,
        bitcoinAddress: bitcoinAddress
    }, (err, doc) => {}),
    find: {
        all: () => {
            return new Promise((resolve, reject) => {
                User.find({}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        oneByID: (userID) => {
            return new Promise((resolve, reject) => {
                User.findOne({userID: Number(userID)}, (err, doc) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc);
                });
            });
        },
        oneByNickname: (nickname) => {
            return new Promise((resolve, reject) => {
                User.find({nickname: new RegExp(nickname)}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            })
        }
    },
    update: {
        addresses: (userID, ethereumAddress, bitcoinAddress) => {
            return new Promise((resolve, reject) => {
                User.updateOne({userID: userID}, {ethereumAddress: ethereumAddress, bitcoinAddress: bitcoinAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        tokenAddresses: async (userID, tokenAddress) => {
            User.find({userID: userID}, (err, doc) => {
                if (err)
                    return err;
                const tokens = doc[0].tokenAddresses;
                tokens.push(tokenAddress);
                return new Promise((resolve, reject) => {
                    User.update({userID: userID}, {tokenAddresses: tokens}, (err, doc) => {
                        if (err)
                            reject(err);
                        resolve(doc);
                    });
                });
            });

        },
        friendsForRestore: async (userID, friends)=>{
            return new Promise((resolve, reject) => {
                User.updateOne({userID: userID}, {friendsForRestore: friends}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        registred: async (userID) => {
            return new Promise((resolve, reject) => {
                User.updateOne({userID: userID}, {isRegistredForBackup: true}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        setWalletAddress: async (userID, walletAddress)=>{
            return new Promise((resolve, reject) => {
                User.updateOne({userID: userID}, {walletAddress: walletAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        setRecoveryAddress : async (userID, recoveryAddress)=>{
            return new Promise((resolve, reject) => {
                User.updateOne({userID: userID}, {recoveryAddress: recoveryAddress}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc);
                });
            });
        },
        signatures: async (userID, r, s, v) => {
            return new Promise((resolve, reject) => {
                User.findOne({userID: Number(userID)}, (err, doc) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let friendsSignatures = doc.friendsSignatures;
                    friendsSignatures.r.push(r);
                    friendsSignatures.s.push(s);
                    friendsSignatures.v.push(v);
                    User.updateOne({userID: userID}, {friendsSignatures: friendsSignatures}, (err, doc) => {
                        if (err)
                            reject(err);
                        resolve(doc);
                    });
                });
            });
        },
    }
};

const transaction = {
    create: async (currency, fromUserID, toUserID, toAddress, amount, amountInUSD, txHash) => Transaction.create({
        currency: currency,
        fromUserID: fromUserID,
        toUserID: toUserID,
        toAddress: toAddress,
        amount: amount,
        amountInUSD: amountInUSD,
        txHash: txHash
    }, (err, doc) => {
    }),
    find: {
        toUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({toUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        },
        fromUserID: (userID) => {
            return new Promise((resolve, reject) => {
                Transaction.find({fromUserID: userID}, (err, doc) => {
                    if (err)
                        reject(err);
                    resolve(doc[0]);
                });
            });
        }
    }
};


module.exports = {
    user: user,
    transaction: transaction,
};
