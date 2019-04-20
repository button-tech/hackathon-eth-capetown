const PageConstructor = require('../PageConstructor');
const WizardScene = require("telegraf/scenes/wizard");
const guid = require('guid');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Telegram = require('../../../shared/messangers/telegram');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const Markup = require('telegraf/markup');


module.exports = {
    setContext: function(stage) {

        const recoverFunds = new WizardScene(
            "recoverFunds",
            start,
            firstNotification
        );

        return async (ctx) => {
            stage.register(recoverFunds);
            return ctx.scene.enter("recoverFunds");
        };

        async function start(ctx) {
            const user = await db.user.find.oneByID(ctx.message.from.id);

            if(user.friendsForRestore.length===0){
                ctx.reply("Firstly add friends!");
                return ctx.scene.leave()
            }

            ctx.session.friends = await Promise.all(user.friendsForRestore.map(userId => db.user.find.oneByID(userId)));

            const friendsButtons = Keyboard.getFriendsButtons(ctx.session.friends);

            ctx.reply("Choose first friend that should help you", Markup
                .keyboard(friendsButtons)
                .resize()
                .extra());

            return ctx.wizard.next();
        }

        function firstNotification(ctx) {
            if(ctx.message.text === Text.back) {
                PageConstructor.render("MainMenu")(ctx);
                return ctx.scene.leave();
            }

            const key = guid.create().value;

            let userID;
            for(let i=0;i<3;i++){
                if(ctx.message.text===ctx.session.friends[i].nickname){
                    userID = ctx.session.friends[i].userID
                }
            }

            // redis.setData(key, JSON.stringify());

            Telegram.sendInlineButton(userID,
                Text.inline_keyboard.save_money.text, Text.inline_keyboard.save_money["0"].button,
                `${Text.inline_keyboard.save_money["0"].callback}${key}`);

            ctx.reply("Wait for conformation from friend");
            PageConstructor.render("MainMenu")(ctx);
            return ctx.scene.leave();
        }

    },
};
