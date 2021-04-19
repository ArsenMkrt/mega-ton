// import SafeMultisigAbi from './solidity/safemultisig-ex/SafeMultisig.abi'
// import SafeMultisigImage from './safemultisig.image'

import SafeMultisigAbi from './solidity/safemultisig/SafeMultisigWallet.abi.json'
import SafeMultisigImage from './safemultisig.image'

var contracts = {
    SafeMultisig: {
        id: 1,
        name: 'Safe Multisig Wallet',
        abi: SafeMultisigAbi,
        image: SafeMultisigImage
    }
}

export default contracts;