const PageConstructor = require('../PageConstructor');
const Markup = require('telegraf/markup');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');

module.exports = {
    setContext: function() {

        PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.wallet.button["0"], "ChooseTransfer", true);
        PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.wallet.button["1"], "SrwChooseTransfer", true);
        PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.wallet.button["2"], "RecoverFunds", true);

        return async (ctx) => {
                return ctx.reply(Text.keyboard.start.text, Markup
                    .keyboard(Keyboard.wallet)
                    .resize()
                    .extra()
                );
            }
    },
};
