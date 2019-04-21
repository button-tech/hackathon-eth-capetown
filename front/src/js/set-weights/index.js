const BL = new Blockchain();
// const Bitcoin = BL.Bitcoin.init({
//     "testnet": Bitcore.Networks.testnet,
//     "mainnet": Bitcore.Networks.livenet,
// }, "mainnet");

/**
 * Start timer
 * @param duration {Number} timer time in minutes
 * @param display body block
 */
// function startTimer(duration, elem) {
//     let timer = duration, minutes, seconds;
//     const bomb = setInterval(function () {
//         minutes = parseInt(timer / 60, 10)
//         seconds = parseInt(timer % 60, 10);
//
//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;
//
//         elem.textContent = minutes + ":" + seconds;
//
//         if (document.getElementById('loader').style.display == '')
//             closeLoader();
//
//         if (--timer < 0) {
//             addError('The link was deleted');
//             clearInterval(bomb)
//         }
//     }, 1000);
// }

/**
 * Allows to get livetime of link
 * @returns {Promise<String>}
 */
async function getLinkLivetime() {
    const guid = getShortlink();
    try {
        const response = await query('GET', `${backendURL}/guid/lifetime/${guid}`);
        if (response.error) {
            addError('Close page and try again');
            return response.error;
        } else
            return new Date(response.result).getTime();
    } catch (e) {
        addError('The link was deleted or not found');
        throw new Error('Can not get livetime of link');
    }
}

/**
 * Allows to sign and send transaction into Blockchain
 * @returns {Promise<void>}
 */
async function sendDeployTransaction() {

    openLoader();
    await loadImage();
    const qrData = await decodeQR();
    const password = getPassword();
    const decryptedData = JSON.parse(decryptData(qrData, password));
    const mySecretKey = decryptedData.Ethereum;

    let wallet = new Wallet();
    document.getElementById('steps').style.display = "block";
    document.getElementById('steps').innerHTML = `<p>[STEP 1/4] Deploying SRW contract from ${window.friends.me.address}</p>`;
    const result = await wallet.deployWallet(mySecretKey);
    const walletAddress = result[0];
    console.log(`walletAddress=${walletAddress}`);
    document.getElementById('steps').innerHTML = `<p>[STEP 2/4] SRW Contract Deployed with address ${walletAddress}</p>`;


    wallet = new Wallet(walletAddress);
    const depositEthTxHash = await wallet.depositEthToWallet(mySecretKey, 0.01);
    console.log(`depositEthTxHas=${depositEthTxHash}`);
    document.getElementById('steps').innerHTML = `<p>[STEP 3/4] Deposit was created with tx hash ${depositEthTxHash}</p>`;
    const friendAddresses = [
        window.friends.friend1.address,
        window.friends.friend2.address,
        window.friends.friend3.address
    ];

    //
    const weights = [
        window.friendWeight1,
        window.friendWeight2,
        window.friendWeight3
    ];

    const setFriendsWeightsTx = await wallet.setFriendsWeights(mySecretKey, friendAddresses, weights);
    console.log(`setFriendsWeightsTx=${setFriendsWeightsTx}`);
    document.getElementById('steps').innerHTML = `<p>[STEP 4/4] Friends weights were finalized on SRE with tx hash ${setFriendsWeightsTx}</p>`;
    await sendWalletAddressToServer(walletAddress);
    await notifyFriends();

    closeLoader();

    alert(`Your SRW wallet contract located at: ${walletAddress}`);
}


async function notifyFriends(currency, network, txHash) {
    const guid = getShortlink();
    const url = `${backendURL}/recovery/register/${guid}`;
    return await query('PUT', url);
}


/**
 * Allows to print url with transaction hash of chosen blockchain explorer
 * @param currency Chosen currency
 * @param network testnet or mainnet
 * @param txHash Hash of transaction
 */
function setTransactionURL(currency, network, txHash) {
    const url = explorers[currency][network] + txHash;
    addSuccess(`<a href="${url}">${url}</a>`);
}

/**
 * Send data of user to server
 * @param userId Telegram unique id
 * @param currency Sending currency
 * @param receiver address that will receive currency
 * @param value amount of currency
 * @returns {Promise<*>}
 */
async function sendWalletAddressToServer(walletAddress) {
    const guid = getShortlink();
    const url = `${backendURL}/walletAddress/${guid}/${walletAddress}`;
    return await query('POST', url);
}

/**
 * Allows to get user password to decrypt cipher text
 * @returns {String} password
 */
function getPassword() {
    const password = document.getElementById('password').value;
    if (password == '')
        addHint('You do not enter password');
    else
        return password;
}

/**
 * Allows to decrypt data from QR code
 * @param cipher QR code data
 * @param password password
 * @returns {String} decrypted data
 */
function decryptData(cipher, password) {
    if (!password) {
        addHint('Enter password');
        throw Error('Enter password');
    }

    try {
        const bytes = CryptoJS.AES.decrypt(cipher, password);
        const data = bytes.toString(CryptoJS.enc.Utf8);

        if (data)
            return data;
        else
            throw Error('Incorrect QR Code or password');
    } catch (e) {
        throw Error('Incorrect QR Code or password')
    }
}

/**
 * Allows to get QR code data
 * @param qrCode IMG selector data
 * @return Cipher text
 */
function decodeQR() {
    return new Promise((resolve, reject) => {
        const img = document.getElementById("qrImage");
        const canvasElement = document.getElementById('canvas');
        const ctx = canvasElement.getContext("2d");
        ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const encodedData = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        encodedData ? resolve(encodedData.data) : reject(false)
    });
}

/**
 * Allows to get file
 */
function loadImage() {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const file = document.querySelector("input[type=file]").files[0];
        if (!file) {
            resolve(false);
        }

        reader.readAsDataURL(file);
        reader.onload = function () {
            document.getElementById("qrImage").src = reader.result;
            document.getElementById("qrImage").onload = () => {
                resolve(true)
            };
        }
    });
}

(async function setTransactionData() {
    const transactionData = await getTransactionData();
    let {
        friend1,
        friend2,
        friend3,
        me
    } = transactionData;

    window.friends = transactionData;


    document.getElementById('friend1').innerText = friend1.address;
    document.getElementById('friendNick1').innerText = friend1.nickname;

    document.getElementById('friend2').innerText = friend2.address;
    document.getElementById('friendNick2').innerText = friend2.nickname;

    document.getElementById('friend3').innerText = friend3.address;
    document.getElementById('friendNick3').innerText = friend3.nickname;
    // document.getElementById('value').innerText = amount;
    // document.getElementById('usd-value').innerText = amountInUSD + ' $';
    closeLoader();

    const deleteDate = await getLinkLivetime();
    const now = Date.now();
    const difference = Number(deleteDate) - now;
    if (difference <= 0) {
        addError('The link was deleted or not found');
        throw new Error('Can not get livetime of link');
    }
    //const differenceInMinute = difference / 1000 / 60;
    //const minutes = 60 * differenceInMinute,
    //elem = document.querySelector('#time');
    // startTimer(minutes, elem);
})();

/**
 * Allows to get transaction properties
 * @returns {Object} Transaction properties
 */
async function getTransactionData() {
    const shortlink = getShortlink();

    try {
        const queryURL = `${backendURL}/guid/data/${shortlink}`;
        const response = await query('GET', queryURL);
        console.log(response)
        if (response.error == null)
            return response.result;
        else {
            throw response.error;
        }
    } catch (e) {
        addError('Can not get transaction properties');
    }
}

/**
 * Allows to get shortlink
 * @returns {String} shortlink
 */
function getShortlink() {
    const demand = ['guid'];

    const url = window.location;
    const urlData = parseURL(url);

    demand.forEach((property) => {
        if (urlData[property] === undefined) {
            addError('Transaction do not contains all parameters');
            throw new Error('URL doesn\'t contain all properties');
        }
    });

    return urlData.guid;
}

/**
 * Allows to parse url string
 * @param url {Location} windows.location
 * @returns {Object}
 */
function parseURL(url) {
    try {
        const params = url.search.substring(1);
        const paramsObject = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        return paramsObject;
    } catch (e) {
        addError('Can not get user identifier. Please, go back to the bot and try again');
        throw e;
    }
}
