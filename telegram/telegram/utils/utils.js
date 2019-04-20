const rp = require('request-promise');
const Web3 = require('web3');

const course = {
    getCourse: async (currency) => {
        const options = {
            method: 'GET',
            uri: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=BTC,ETH,USD`,
            json: true
        };
        return rp(options);
    },
    /**
     * Allows to convert currencies
     * @param from Currency that will be changed
     * @param to Destination currency
     * @param value Amount of currency that will be changed
     * @returns {Promise<number>}
     */
    convert: async (from, to, value) => {
        const courses = await course.getCourse(from);
        const rate = courses[to];
        const result = Number(value) * rate;
        return from === "USD" ? result : Number(Number(result.toFixed(2)).toString());
    }
};

module.exports = {
    course: course,
    web3Mainnet: new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/${process.env.INFURA_TOKEN}`)),
    web3Ropsten: new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${process.env.INFURA_TOKEN}`)),
    web3Rinkeby: new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/${process.env.INFURA_TOKEN}`)),
    web3XDai: new Web3(new Web3.providers.HttpProvider('https://dai.poa.network/'))
};

