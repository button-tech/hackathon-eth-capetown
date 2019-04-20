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

    }
};




module.exports = {
    user: user,
    transaction: transaction,
};
