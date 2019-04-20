const Markup = require('telegraf/markup');
const Text = require('../text');

const start = [
    [Text.keyboard.start.button["0"], Text.keyboard.start.button["1"]],
    [Text.keyboard.start.button["2"], Text.keyboard.start.button["3"]],
    [Text.keyboard.start.button["4"]],
];

const startRegistredForBackup = [
    [Text.keyboard.start.button["0"], Text.keyboard.start.button["6"]],
    [Text.keyboard.start.button["5"], Text.keyboard.start.button["3"]],
    [Text.keyboard.start.button["4"], Text.keyboard.start.button["1"]],
];

const account = [
    [Text.keyboard.account.button["0"]],
    [Text.keyboard.account.button["1"]],
    [Text.back]
];

const chooseTransfer = [
    ["Ethereum"],
    ["DAI"],
];

const back = [
    Text.back
];

function getFriendsButtons(friends) {
    return [
        [friends[0].nickname, friends[1].nickname, friends[2].nickname],
        [Text.back]
    ]
}

const selectOtherFriends = Markup.inlineKeyboard([
    Markup.callbackButton(Text.inline_keyboard.save_money["1"].button, Text.inline_keyboard.save_money["1"].callback)
]);

const create_wallet = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, `${Text.inline_keyboard.create_wallet["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction  = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, `${Text.inline_keyboard.send_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const save_money  = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.save_money["0"].button, `${Text.inline_keyboard.save_money["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

module.exports = {
    start: start,
    account: account,
    // restore: restore,
    create_wallet: create_wallet,
    create_transaction: create_transaction,
    save_money: save_money,
    back:back,
    getFriendsButtons:getFriendsButtons,
    selectOtherFriends: selectOtherFriends,
    startRegistredForBackup: startRegistredForBackup,
    chooseTransfer: chooseTransfer
};

