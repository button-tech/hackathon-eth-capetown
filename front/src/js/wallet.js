function toUIntStr(n) {
    let s = n.toString(16);
    let p = Array(64 - s.length).fill('0').join('');
    return "0x" + p + s;
}

const toWei = web3.utils.toWei;
// Only for hackathon need to be (await web3.eth.getBlock("latest")) + 5760;
const blockLimit = 9999999;

const toHexWeiString = (amount) => "0x"+(amount*10**18).toString(16)

class Wallet {

    constructor(address) {
        this.wallet = getInstance(wallet_abi, address);
        this.walletAddress = address;
    }

    // return: new contract address
    async deployWallet(privateKey) {
        // const nextNonce = Number(await web3.eth.getTransactionCount(getAddress(privateKey))) + 1;
        const signedData = await signTransaction(privateKey, null, null, [bytecode], [3 * 10 ** 6]);
        return sendSigned(signedData, true);
    }

    // return: transaction hash
    async depositEthToWallet(privateKey, amount) {
        const signedData = await signTransaction(privateKey, this.walletAddress, toHexWeiString(amount), "",[1 * 10 ** 6]);
        return sendSigned(signedData);
    }

    async depositTokenToWallet(privateKey, tokenAddress, amount) {
        return sendToken(tokenAddress, privateKey, this.walletAddress, toHexWeiString(amount));
    }

    async transferEthFromWallet(privateKey, to, amount) {
        amount = toHexWeiString(amount.toString());
        return set(this.wallet, "exec", privateKey, 0, [to, amount, "0", "0x"]);
    }

    async transferTokenFromWallet(privateKey, tokenAddress, to, amount) {
        amount = toHexWeiString(amount.toString());
        const instance = getInstance(ABI, tokenAddress);
        const data = getCallData(instance, "transfer", [to, "10000000000000000"]);
        return set(this.wallet, "exec", privateKey, 0, [to, "0", "0", data]);
    }

    // return: transaction hash
    async setFriendsWeights(privateKey, friends, weights) {
        weights = weights.map(w => toWei(w.toString()));
        const weightsHash = ethers.utils.solidityKeccak256(["address[]", "uint256[]"],
            [friends, weights]);

        const p = new Promise((resolve, reject) => {

            setTimeout(async () => {

                //const nonce1 = await web3.eth.getTransactionCount(getAddress(privateKey));
                const addWeightUpdateRequest = await set(this.wallet,
                    "addWeightUpdateRequest",
                    privateKey,
                    0,
                    [weightsHash],
                    // nonce1
                );

                setTimeout(async () => {
                    const finalizeWeightUpdateRequest = await set(
                        this.wallet,
                        "finalizeWeightUpdateRequest",
                        privateKey,
                        0,
                        [weightsHash, friends, weights],
                    );

                    resolve(addWeightUpdateRequest);
                }, 20000);
            }, 20000);
        });

        const addWeightUpdateRequest = await p;
        return addWeightUpdateRequest;
    }

    // Return Example
    // {
    //      "message":"0x5817a817284a25996cf471299ba31908b9ff7bb9b4ec073d781021f971c8af66",
    //      "messageHash":"0x7b0e11fb423c9d45bc97669e083584b84d038df134abaff6d258e6d321a6861c",
    //      "v":"0x1c",
    //      "r":"0x3d9fea34e1c60e18ade97cd8be8b453838b36b21ea7fdf1ecaa5b6e7e7664ea9",
    //      "s":"0x3ed60c67e0ddae038eca3b43a5520c0dea4b542fcad5a2e78dbe221d702641dd",
    //      "signature":"0x3d9fea34e1c60e18ade97cd8be8b453838b36b21ea7fdf1ecaa5b6e7e7664ea93ed60c67e0ddae038eca3b43a5520c0dea4b542fcad5a2e78dbe221d702641dd1c"
    // }
    // HINT: Need to record v,r,s to database and you can show signature to user
    signNewOwner(privateKey, newOwner) {
        let message = "0x" + newOwner.substr(2) + toUIntStr(blockLimit).substring(2);
        return web3.eth.accounts.sign(message, privateKey);
    }

    // return - transaction hash
    async moveOwner(privateKey, newOwner, v, r, s) {
        return set(this.wallet, "moveOwner", privateKey, 0, [newOwner, toUIntStr(blockLimit), v, r, s]);
    }

}




