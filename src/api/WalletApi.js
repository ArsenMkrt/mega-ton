import WalletDb from "./WalletDb";
import CryptoApi from "./CryptoApi";
import ConverterApi from "./ConverterApi";

const WalletApi = {
    async hasMasterPassword() {
        const settingsStorage = await WalletDb.getSettingsStorage();
        const passRecord = await settingsStorage.get('masterPass');

        return passRecord ? true : false;
    },

    async setMasterPassword(password) {
        const settingsStorage = await WalletDb.getSettingsStorage();

        const nonce = CryptoApi.generateSalt();
        const cryptedPass = CryptoApi.calcSHA512(password + nonce);

        await settingsStorage.put({
            name: 'masterPass',
            value: {
                'hash': cryptedPass,
                'nonce': nonce
            }
        });
    },

    async validateMasterPassword(password) {
        const settingsStorage = await WalletDb.getSettingsStorage();
        const passRecord = await settingsStorage.get('masterPass');

        if (!passRecord)
            return false;

        const cryptedPass = CryptoApi.calcSHA512(password + passRecord.value.nonce);
        return (cryptedPass === passRecord.value.hash);
    },

    async getSelectedNetworkId() {
        const settingsStorage = await WalletDb.getSettingsStorage();

        const networkId = await settingsStorage.get('selectedNetworkId');
        return networkId ? networkId.value : null;
    },

    async setSelectedNetworkId(networkId) {
        var settingsStorage = await WalletDb.getSettingsStorage();

        await settingsStorage.put({
            name: 'selectedNetworkId',
            value: networkId
        });
    },

    async getWallets() {
        const walletStorage = await WalletDb.getWalletStorage();
        const allWallets = await walletStorage.getAll();

        return allWallets;
    },

    async getWallet(id) {
        const walletStorage = await WalletDb.getWalletStorage();
        const wallet = await walletStorage.get(id);

        return wallet;
    },

    async getAccountData(network, walletId){
        if (!walletId)
            return null;
        
        const wallet = await this.getWallet(walletId);
        if (!wallet?.deployData?.address)
            return null;
        
        const result = await network.provider.getAccountData(wallet.deployData.address);
        return result?.[0];
    },

    async subscribeAccountChange(network, wallets, onChange) {

        const walletsWithAddress = wallets
            .filter(nw => nw.deployData && nw.deployData.address);
        const addresses = walletsWithAddress
            .map(nw => nw.deployData.address);

        if (!addresses || addresses.length === 0)
            return () => {

            };

        const result = await network.provider.getAccountData(addresses);

        wallets.forEach(wlt => {
            var walletData = result.filter(rs => rs.id === wlt.deployData.address)?.[0];
            
            onChange({
                address: wlt.deployData.address,
                balance: walletData?.balance ?? '0',
                codeHash: walletData?.code_hash ?? null
            });
        });

        var unsub = await network.provider.onAccountChange(addresses, chng => {
            onChange({
                address: chng.id,
                balance: chng.balance,
                codeHash: chng.code_hash
            })
        });

        return () => {
            if (unsub?.unsubscribe){
                unsub?.unsubscribe();
            }
        }
    },


    async generateMnemonic(network) {
        return await network.provider.generateMnemonic();
    },


    async createWallet(network, seed, password) {
        const walletStorage = await WalletDb.getWalletStorage();
        const allWallets = await walletStorage.getAll();
        const networkWallets = allWallets.filter(wlt => wlt.networkId === network.id);

        const keys = await network.provider.generateKeys(seed);

        const salt = CryptoApi.generateSalt();
        const passCode = CryptoApi.calcPBKDF2(password, salt);
        
        const encryptedSecret = CryptoApi.encryptAES(keys.secret, passCode);
        const encryptedSeed = CryptoApi.encryptAES(seed, passCode);

        const deployData = await network.provider.getDeployData(keys);

        const wallet = {
            name: `Wallet ${networkWallets.length + 1}`,
            encryptedSeed: encryptedSeed,
            salt: salt,
            deployData: {
                address: deployData.address,
                accountId: deployData.accountId,
            },
            networkId: network.id,
            keys: {
                public: keys.public,
                encryptedSecret: encryptedSecret
            }
        };

        await walletStorage.put(wallet);
    },

    async deleteWallet(id){
        const walletStorage = await WalletDb.getWalletStorage();
        await walletStorage.delete(id);
    },

    async getSmartContracts(network){
        const contracts = await network.provider.getSmartContracts();
        return contracts;
    },

    async calculateDeployFee(network, walletId, password){
        var keys = await this._getDecryptedKeys(walletId, password);
        var result = await network.provider.calcDeployFees(keys);
        return result;
    },

    async deployContract(network, walletId, password){
        var keys = await this._getDecryptedKeys(walletId, password);
        return await network.provider.deployContract(keys);
    },

    async calculateTransactionFee(network, walletId, password, destAddress, ammount, comment){
        const wallet = await this.getWallet(walletId);
        const keys = await this._getDecryptedKeys(walletId, password);
        const nanoAmmount = ConverterApi.toNano(ammount);

        const result = await network.provider.calcTransactionFees(
            keys, 
            wallet.deployData.address,
            destAddress,
            nanoAmmount,
            comment);
        return result;
    },

    async sendTokens(network, walletId, password, destAddress, ammount, comment){
        const wallet = await this.getWallet(walletId);
        const keys = await this._getDecryptedKeys(walletId, password);
        const nanoAmmount = ConverterApi.toNano(ammount);

        return await network.provider.sendTransaction(keys, wallet.deployData.address, destAddress, nanoAmmount, comment);
    },

    async _getDecryptedKeys(walletId, password){
        const walletStorage = await WalletDb.getWalletStorage();
        const wallet = await walletStorage.get(walletId);

        const passCode = CryptoApi.calcPBKDF2(password, wallet.salt);
        
        return {
            public: wallet.keys.public,
            secret: CryptoApi.decryptAES(wallet.keys.encryptedSecret, passCode)
        };
    },

    _generateNonce(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

export default WalletApi;