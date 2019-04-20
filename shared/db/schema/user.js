const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    userID: {
        type: Number,
    },
    nickname: {
        type: String,
        default: ''
    },
    ethereumAddress: {
        type: String,
        default: ''
    },
    friendsForRestore:[Number],
    isRegistredForBackup: {
      type: Boolean,
      default: false
    },
    recoveryAddress: {
        type: String,
        default: ''
    },
    walletAddress: String,
    tmpAddress: {
        type: String,
        default: ''
    },
    friendsSignatures: {
        r: Array,
        s: Array,
        v: Array,
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);
