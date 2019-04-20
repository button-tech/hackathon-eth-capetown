const WizardScene = require("telegraf/scenes/wizard");
const Extra = require('telegraf/extra');
const guid = require('guid');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const redis = require('../../../shared/redis/redis');
const utils = require('../../utils/utils');
const Markup = require('telegraf/markup');

const keyLifetime = 600;
// v1.0
module.exports = {
    setContext: function(stage) {

        const transferDai = new WizardScene(
            "transferDai",
            chooseReceiver,
            enterAmount,
            prepareTransaction
        );

        return async (ctx) => {
            stage.register(transferDai);
            return ctx.scene.enter("transferDai");
        };

        function chooseReceiver(ctx) {
            ctx.session.currency = "DAI";
            ctx.reply(Text.dialog.sendTransaction["2"], Markup
                .keyboard(Keyboard.back)
                .resize()
                .extra());
            return ctx.wizard.next()
        }

        function enterAmount(ctx) {
            if(ctx.message.text === Text.back){
                ctx.reply(Text.keyboard.account.text, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra()
                );
                return ctx.scene.leave();
            }
            ctx.session.to = ctx.message.text;
            ctx.reply(Text.dialog.sendTransaction["3"]);
            return ctx.wizard.next()
        }

        async function prepareTransaction(ctx) {
            if(ctx.message.text === Text.back){
                ctx.reply(Text.keyboard.account.text, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra()
                );
                return ctx.scene.leave();
            }
            const tickerFrom = "DAI";
            const currency = ctx.session.currency;
            let amount;
            let amountInUsd;
            if (ctx.message.text.indexOf("$") >= 0) {
                amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
                amount = ctx.message.text.substring(0, ctx.message.text.length-1);
            } else {
                amount = ctx.message.text;
                amountInUsd = ctx.message.text;
            }
            const key = guid.create().value;

            const userTo = ctx.session.to;

            let toUserID;
            let toAddress;
            let checker = false;
            let fromAddress;

            const user = await db.user.find.oneByID(ctx.message.from.id);
            fromAddress = user[`ethereumAddress`];

            if (utils.web3Rinkeby.utils.isAddress(userTo)) {
                toAddress = userTo;
            } else {
                let to = ctx.session.to;
                if (to.match('@')) {
                    to = to.substring(1);
                }
                const user = await db.user.find.oneByNickname(to);
                if (user) {
                    toUserID = user.userID;
                    toAddress = user.ethereumAddress;
                    checker = true;
                } else {
                    ctx.reply("User not defined");
                    ctx.reply(Text.keyboard.start.text, Markup
                        .keyboard(Keyboard.start)
                        .resize()
                        .extra()
                    );
                    return ctx.scene.leave();
                }
            }

            const value = JSON.stringify({
                type: "basic-transfer",
                currency: currency,
                fromUserID: ctx.message.from.id,
                toUserID: toUserID ? toUserID : 'null',
                fromAddress: fromAddress,
                toNickname: checker ? ctx.session.to : '',
                toAddress: toAddress,
                amount: amount,
                amountInUSD: amountInUsd,
                lifetime: Date.now() + (keyLifetime * 1000),
            });

            redis.setData(key, value, keyLifetime);
            ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

            return ctx.scene.leave();
        }

    },
};