const PageConstructor = require('../PageConstructor');
const Markup = require('telegraf/markup');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');

module.exports = {
        setContext: function() {

            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.account.button["0"], "MyBalance");
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.account.button["1"], "MyAddress");
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.account.button["2"], "FriendsList");
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.account.button["3"], "CreateBackup", true);

            return async (ctx) => {
                ctx.reply(Text.keyboard.account.text, Markup
                    .keyboard(Keyboard.account)
                    .resize()
                    .extra()
                )
            };

        },
    };
