const PageConstructor = require('../PageConstructor');
const WizardScene = require("telegraf/scenes/wizard");
const guid = require('guid');
const Extra = require('telegraf/extra');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const redis = require('../../../shared/redis/redis');
const Markup = require('telegraf/markup');

module.exports = {
    setContext: function(stage) {

        const createBackup = new WizardScene(
            "createBackup",
            start,
            setFirst,
            setSecond,
            setThirdRecordDataToRedisAndGoToFront
        );


        return async (ctx) => {
            stage.register(createBackup);
            return ctx.scene.enter("createBackup");
        };

        async function start(ctx) {
            const me = await db.user.find.oneByID(ctx.message ? ctx.message.from.id : ctx.update.callback_query.from.id);
            if (me.friendsForRestore.length !== 0) {
                PageConstructor.setCallbackButtonPageCallback(Text.inline_keyboard.save_money["1"].callback, "ReElectFriends", ctx.scene);
                ctx.reply(Text.dialog.createBackup["0"], Extra.markup(Keyboard.selectOtherFriends));
                return ctx.scene.leave();
            } else {
                ctx.session.friends = [];
                ctx.reply(Text.dialog.createBackup["1"],Markup
                    .keyboard(Keyboard.back)
                    .resize()
                    .extra());
                return ctx.wizard.next();
            }
        }

        async function setFirst(ctx) {
            if(ctx.message.text === Text.back) {
                PageConstructor.render("MainMenu")(ctx);
                return ctx.scene.leave();
            }

            const friend = await db.user.find.oneByNickname(ctx.message.text);

            if(friend===undefined){
                ctx.reply(Text.inline_keyboard.save_money.err.notReg, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra());

                return ctx.scene.leave();
            }

            ctx.session.friends.push(friend);

            ctx.reply(Text.dialog.createBackup["2"],Markup
                .keyboard(Keyboard.back)
                .resize()
                .extra());

            return ctx.wizard.next();
        }

        async function setSecond(ctx) {
            if(ctx.message.text === Text.back) {
                PageConstructor.render("MainMenu")(ctx);
                return ctx.scene.leave();
            }

            const friend = await db.user.find.oneByNickname(ctx.message.text);
            if(friend===undefined){
                ctx.reply(Text.inline_keyboard.save_money.err.notReg, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra());

                return ctx.scene.leave();
            }


            ctx.session.friends.push(friend);
            ctx.reply(Text.dialog.createBackup["3"],Markup
                .keyboard(Keyboard.back)
                .resize()
                .extra());

            return ctx.wizard.next();
        }

        async function setThirdRecordDataToRedisAndGoToFront(ctx) {
            if(ctx.message.text === Text.back) {
                PageConstructor.render("MainMenu")(ctx);
                return ctx.scene.leave();
            }

            const friend = await db.user.find.oneByNickname(ctx.message.text);

            if(friend===undefined){
                ctx.reply(Text.inline_keyboard.save_money.err.notReg, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra());

                return ctx.scene.leave();
            }

            ctx.session.friends.push(friend);

            const friends = ctx.session.friends;
            const key = guid.create().value;
            const value = {};
            for (let i = 0; i < friends.length; i++) {
                value[`friend${i+1}`] = {
                    address: friends[i].ethereumAddress,
                    userId: friends[i].userID,
                    nickname: friends[i].nickname
                };
            }
            const sender = await db.user.find.oneByID(ctx.message.from.id);
            value["me"] = {
              address:   sender.ethereumAddress,
              userId: sender.userID,
              nickname: sender.nickname
            };
            redis.setData(key, JSON.stringify(value));
            await db.user.update.friendsForRestore(ctx.message.from.id, friends.map(v => v.userID));

            ctx.reply(Text.inline_keyboard.save_money.text, Extra.markup(Keyboard.save_money(key)));
            PageConstructor.render("MainMenu")(ctx);
            return ctx.scene.leave();
        }
    },
};
