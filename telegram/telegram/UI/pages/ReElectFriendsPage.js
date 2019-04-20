const PageConstructor = require('../PageConstructor');
const db = require('../../../shared/db/db');

module.exports = {
    setContext: function() {

        return async (ctx) => {
            await db.user.update.friendsForRestore(ctx.update.callback_query.from.id, []);
            return PageConstructor.renderScene("CreateBackup")(ctx);
        };
    }
};
