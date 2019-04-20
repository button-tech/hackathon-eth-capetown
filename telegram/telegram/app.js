const Telegraf = require('telegraf');
const session = require('telegraf/session');
const PageConstructor = require('./UI/PageConstructor');
const CallbackRegister = require('./UI/CallbackRegister');
const Text = require('../shared/text');
const express = require('express');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(bot.webhookCallback('/bot'));
bot.telegram.setWebhook(process.env.NGROK + '/bot');

bot.use(session({ ttl: 10 }));

const callbackRegister = new CallbackRegister(bot);
callbackRegister.loadCallbacksFromRedis();
PageConstructor.init(bot, callbackRegister);

bot.start(PageConstructor.render("MainMenu"));
bot.hears(Text.back, PageConstructor.render("MainMenu"));

app.post('/bot', (req, res) => {});

app.listen(8080,()=>{
    console.log("Nice!")
});

