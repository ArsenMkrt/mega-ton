const Navigation = {
    async goToSetMasterPassword(history) {
        history.push('/');
    },

    async goToWalletList(history) {
        history.push('/wallet/list');
    },

    async goToNewWallet(history, network) {
        history.push({
            pathname: '/wallet/new',
            state: {
                networkId: network.id
            }
        });
    },

    async goToImportWallet(history, network) {
        history.push({
            pathname: '/wallet/import',
            state: {
                networkId: network.id
            }
        });
    },

    async goToSendTokens(history, network, wallet) {
        history.push({
            pathname: '/wallet/send-tokens',
            state: {
                networkId: network.id,
                walletId: wallet.id,
                codeHash: wallet.codeHash
            }
        });
    }
}

export default Navigation;