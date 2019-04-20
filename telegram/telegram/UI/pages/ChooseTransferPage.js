const WizardScene = require("telegraf/scenes/wizard");
const PageConstructor = require('../PageConstructor');
const Extra = require('telegraf/extra');
const guid = require('guid');
const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const db = require('../../../shared/db/db');
const redis = require('../../../shared/redis/redis');
const utils = require('../../utils/utils');
const Markup = require('telegraf/markup');

const keyLifetime = 600;

module.exports = {
    setContext: function(stage) {
        PageConstructor.setKeyboardButtonPageCallback("Ethereum", "Transfer", true);
        PageConstructor.setKeyboardButtonPageCallback("DAI", "TransferDai", true);

        let chooseTransfer = new WizardScene(
            "ChooseTransfer",
            sendKeyboard,
            choose,
        );

        return async (ctx) => {
            await stage.register(chooseTransfer);
            return ctx.scene.enter("ChooseTransfer");
        };

        function sendKeyboard(ctx) {
            ctx.reply(Text.dialog.sendTransaction["1"], Markup
                .keyboard(Keyboard.chooseTransfer)
                .resize()
                .extra());
            return ctx.wizard.next()
        }

        function choose(ctx) {
            if (ctx.message.text === "Ethereum") {
                PageConstructor.renderScene("Transfer")(ctx);
            } else if (ctx.message.text === "DAI") {
                PageConstructor.renderScene("TransferDai")(ctx);
            }
            return ctx.scene.leave();
        }

    },
};