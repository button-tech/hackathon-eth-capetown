const WizardScene = require("telegraf/scenes/wizard");
const Extra = require('telegraf/extra');
const guid = require('guid');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const redis = require('../../../shared/redis/redis');
const utils = require('../../utils/utils');
const Markup = require('telegraf/markup');
var ethers = require('ethers');
var provider = new ethers.providers.InfuraProvider("homestead", "authcointop");

const keyLifetime = 600;

module.exports = {
    setContext: function (stage) {

        const sendEth = new WizardScene(
            "sendEth",
            chooseReceiver,
            enterAmount,
            prepareTransaction
        );

        return async (ctx) => {
            stage.register(sendEth);
            return ctx.scene.enter("sendEth");
        };

        function chooseReceiver(ctx) {
            ctx.session.currency = "Ethereum";
            ctx.reply(Text.dialog.sendTransaction["2"], Markup
                .keyboard(Keyboard.back)
                .resize()
                .extra());
            return ctx.wizard.next()
        }

        async function enterAmount(ctx) {
            if (ctx.message.text === Text.back) {
                ctx.reply(Text.keyboard.account.text, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra()
                );
                return ctx.scene.leave();
            }
            if (ctx.message.text.substr(ctx.message.text.length - 4) === ".eth") {
                let address;
                provider.resolveName(ctx.message.text).then((res) => {
                    address = res;
                    if (address !== null) {
                        console.log(address + " info");
                        ctx.session.to = address.toString();
                        ctx.reply(ctx.message.text + " is " + address);
                    }
                });
            }
            else {
                ctx.session.to = ctx.message.text;
            }
            ctx.reply(Text.dialog.sendTransaction["3"]);
            return ctx.wizard.next()
        }

        async function prepareTransaction(ctx) {
            if (ctx.message.text === Text.back) {
                ctx.reply(Text.keyboard.account.text, Markup
                    .keyboard(Keyboard.start)
                    .resize()
                    .extra()
                );
                return ctx.scene.leave();
            }
            const tickerFrom = "ETH";
            const currency = ctx.session.currency;
            let amount;
            let amountInUsd;

            // await provider.resolveName('ethereum.eth');

            if (ctx.message.text.indexOf("$") >= 0) {
                amountInUsd = ctx.message.text.substring(0, ctx.message.text.length - 1);
                amount = Number(await utils.course.convert("USD", tickerFrom, amountInUsd));

            } else {
                amount = ctx.message.text;
                amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
            }
            const key = guid.create().value;

            const userTo = ctx.session.to;

            let toUserID;
            let toAddress;
            let checker = false;
            let fromAddress;

            const user = await db.user.find.oneByID(ctx.message.from.id);
            fromAddress = user[`ethereumAddress`];

            if (currency == 'Ethereum' && utils.web3Rinkeby.utils.isAddress(userTo)) {
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

