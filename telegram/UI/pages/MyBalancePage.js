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

            const optionsForSRW = {
                method: 'GET',
                uri: `http://35.204.234.72:4228/eth/tokenBalance/0xef77ce798401dac8120f77dc2debd5455eddacf9/${user.walletAddress}`,
                json: true
            };

            const balanceDAI = await rp(options);
            const ethBalanceInUsd = Number(await utils.course.convert("ETH", "USD", balanceEthRinkeby/1e18));
            const srwEthBalance = user.walletAddress ? (await utils.web3Rinkeby.eth.getBalance(user.walletAddress)) : 0;
            const srwEthBalanceInUsd = srwEthBalance !== 0 ? " or " + Number(await utils.course.convert("ETH", "USD", srwEthBalance/1e18)) : "";
            console.log(srwEthBalanceInUsd)

            let msg = `*Your balance:* ${balanceEthRinkeby/1e18} or ${(ethBalanceInUsd)}$ \n\n *DAI balance:* ${balanceDAI.balance}\n\n *SRW ETH balance*: ${srwEthBalance}${srwEthBalanceInUsd}\n\n *SRW DAI balance*: ${user.walletAddress ? (await rp(optionsForSRW)).balance : 0}`;
            ctx.reply(msg, { parse_mode: 'Markdown' });
        };

    },
};
