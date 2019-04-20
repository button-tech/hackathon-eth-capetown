const PageConstructor = require('../PageConstructor');
const Markup = require('telegraf/markup');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');

module.exports = {
        setContext: function() {

            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.start.button["0"], "MyAccount");
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.start.button["1"], "ChooseTransfer", true);
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.start.button["2"], "CreateBackup", true);
            PageConstructor.setKeyboardButtonPageCallback(Text.keyboard.start.button["3"], "RecoverFunds", true);

            return async (ctx) => {
                const user = await db.user.find.oneByID(ctx.message ? ctx.message.from.id : ctx.update.callback_query.from.id);
                if (user) {
                    const keyboard = user.isRegistredForBackup ? Keyboard.startRegistredForBackup : Keyboard.start;
                    return ctx.reply(Text.keyboard.start.text, Markup
                        .keyboard(keyboard)
                        .resize()
                        .extra()
                    );
                }
                else
                    return PageConstructor.render("CreateAccount")(ctx)
            };
        },
    };
