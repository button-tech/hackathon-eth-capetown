const Stage = require("telegraf/stage");

module.exports = (function () {
    let bot;
    let callbackRegister;
    const stage = new Stage();

    return {
       init: (b, c) => {
           bot = b;
           callbackRegister = c;
           bot.use(stage.middleware());
       },
       render: function(pageName) {
           if (!bot)
               throw new Error("PageConstructor not init");
            try {
                return require(`./pages/${pageName}Page`).setContext();
            } catch (e) {
                return () => console.log(e);
            }
        },
        renderScene: function(pageName) {
            if (!bot)
                throw new Error("PageConstructor not init");
            try {
                return require(`./pages/${pageName}Page`).setContext(stage);
            } catch (e) {
                return () => console.log(e);
            }
        },
        setKeyboardButtonPageCallback: function(buttonText, pageName, isScene = false) {
            if (!bot)
                throw new Error("PageConstructor not init");
            if (!isScene)
                bot.hears(buttonText, this.render(pageName));
            else
                bot.hears(buttonText, this.renderScene(pageName));
        },
        setCallbackButtonPageCallback: function (callbackText, pageName, scene) {
            if (!bot)
                throw new Error("PageConstructor not init");
            callbackRegister.add(callbackText, pageName, scene)
        }
    };
})();
