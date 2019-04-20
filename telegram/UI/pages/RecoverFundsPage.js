const PageConstructor = require('../PageConstructor');
const WizardScene = require("telegraf/scenes/wizard");
const guid = require('guid');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Telegram = require('../../../shared/messangers/telegram');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const redis = require('../../../shared/redis/redis');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');


module.exports = {
    setContext: function(stage) {

        const recoverFunds = new WizardScene(
            "recoverFunds",
            start,
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

            // ctx.session.friends = await Promise.all(user.friendsForRestore.map(userId => db.user.find.oneByID(userId)));
            //
            // const friends = ctx.session.friends;
            // for (let i = 0; i < friends.length; i ++) {
            //     const key = guid.create().value;
            //     const value = JSON.stringify({
            //         troubleUserId: user.userID,
            //         helperNickname: friends[i].nickname,
            //         newOwnerAddress: friends[i].recoveryAddress
            //     });
            //     redis.setData(key, value);
            //     Telegram.sendInlineButton(friends[i].userID,
            //         `Your friend @${friends[i].nickname} needs your help`, Text.inline_keyboard.save_money["2"].button,
            //         `${Text.inline_keyboard.save_money["2"].callback}${key}`);
            // }

            const key = guid.create().value;
            const value = JSON.stringify({
                userID: user.userID,
            });
            redis.setData(key, value);

            ctx.reply("Create new account and wait for conformation from friends",  Extra.markup(Keyboard.restore_acc(key)));
            PageConstructor.render("MainMenu")(ctx);
            return ctx.scene.leave();
        }

    },
};
