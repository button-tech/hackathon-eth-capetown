const Keyboard = require('../../../shared/keyboard/keyboard');
const Text = require('../../../shared/text');
const redis = require('../../../shared/redis/redis');
const guid = require('guid');
const Extra = require('telegraf/extra');

const keyLifetime = 600;

module.exports = {
        setContext: function() {

            return async (ctx) => {
                const key = guid.create().value;

                redis.setData(key, JSON.stringify({
                    userID: ctx.message.from.id,
                    nickname: ctx.message.from.username,
                    lifetime: Date.now() + (keyLifetime * 1000)
                }), keyLifetime);

                return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet(key)));
            };

        },
    };
