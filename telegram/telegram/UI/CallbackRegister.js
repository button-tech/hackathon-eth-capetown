'use strict';
const PageConstructor = require('./PageConstructor');
const CircularJSON = require('circular-json');
const redis = require("../../shared/redis/redis");

module.exports = class CallbackRegister {
    constructor(bot) {
        this.bot = bot;

        this.callbacks = [];
        this.pages  = [];
        this.scenes = [];

        bot.on("callback_query", (ctx) => {
            const callback = ctx.callbackQuery.data;
            const callbackIndex = this.callbacks.indexOf(callback);
            ctx.answerCbQuery();
            if (callbackIndex == -1) {
                PageConstructor.render("MainMenu")(ctx);
                return
            }
            const neededPage = this.pages[callbackIndex];
            if (neededPage == undefined) {
                PageConstructor.render("MainMenu")(ctx);
                return
            }
            ctx["scene"] = this.scenes[callbackIndex];
            return PageConstructor.render(neededPage)(ctx);
        });
    }

    async loadCallbacksFromRedis() {
        const callbacksObject = CircularJSON.parse(await redis.getData("callbacks"));
        if (callbacksObject) {
            this.callbacks = callbacksObject.callbacks.length > 0 ? callbacksObject.callbacks: [];
            this.pages  = callbacksObject.pages.length > 0 ? callbacksObject.pages : [];
            this.scenes = callbacksObject.scenes.length > 0 ? callbacksObject.scenes : [];
        }
    }

    add(callback, page, scene) {
        if (this.callbacks.indexOf(callback) != -1)
            return;
        this.callbacks.push(callback);
        this.pages.push(page);
        this.scenes.push(scene);
        const cb = this.callbacks;
        const pg = this.pages;
        const sc = this.scenes;
        // TODO: Currently working only with callbacks without scenes
        if (scene == undefined) {
            redis.setData("callbacks", CircularJSON.stringify({
                callbacks: cb,
                pages: pg,
                scenes: sc
            }));
        }
    }
};
