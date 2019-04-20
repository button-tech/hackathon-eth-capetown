const db = require('../../../shared/db/db');

module.exports = {
        setContext: function() {

            return async (ctx) => {
                const user = await db.user.find.oneByID(ctx.message ? ctx.message.from.id : ctx.update.callback_query.from.id);
                const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\`\n SRW Address: ....`;
                return ctx.reply(text, { parse_mode: 'Markdown' });
            };

        },
    };
