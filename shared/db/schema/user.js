const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    friendsForRestore:[Number],
    isRegistredForBackup: {
      type: Boolean,
      default: false
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', User);
