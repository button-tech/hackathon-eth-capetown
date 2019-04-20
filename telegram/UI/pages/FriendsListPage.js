const db = require('../../../shared/db/db');


module.exports = {
    setContext: function() {
        return async (ctx) => {
            const user = await db.user.find.oneByID(ctx.message.from.id);

            if(user.friendsForRestore.length===0){
                ctx.reply("You must choose friends before");
                return;
            }

            const firstFriend = await db.user.find.oneByID(user.friendsForRestore[0]);
            const secondFriend = await db.user.find.oneByID(user.friendsForRestore[1]);
            const thirdFriend = await db.user.find.oneByID(user.friendsForRestore[2]);

            let firstMsg = `Your chosen friends:\n1.@${firstFriend.nickname} - ${firstFriend.ethereumAddress}\n`;
            let secondMsg = `2.@${secondFriend.nickname} - ${secondFriend.ethereumAddress}\n`;
            let thirdMsg = `3.@${thirdFriend.nickname} - ${secondFriend.ethereumAddress}`;

            ctx.reply(firstMsg + secondMsg + thirdMsg);
        };

    },
};
