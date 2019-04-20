const db = require('../../../shared/db/db');
const utils = require('../../utils/utils');
const rp = require('request-promise');

module.exports = {
    setContext: function() {
        return async (ctx) => {
            const user = await db.user.find.oneByID(ctx.message.from.id);

            const balanceEthRinkeby = await utils.web3Rinkeby.eth.getBalance(user.ethereumAddress);

            const options = {
                method: 'GET',
                uri: `http://35.204.234.72:4228/eth/tokenBalance/0xef77ce798401dac8120f77dc2debd5455eddacf9/${user.ethereumAddress}`,
                json: true
            };

            const balanceDAI = await rp(options);
            const ethBalanceInUsd = Number(await utils.course.convert("ETH", "USD", balanceEthRinkeby/1e18));
            let msg = `*Your balance:* ${balanceEthRinkeby/1e18} or ${(ethBalanceInUsd)}$ \n\n *DAI balance:* ${balanceDAI.balance}\n\n`;
            ctx.reply(msg, { parse_mode: 'Markdown' });
        };

    },
};
