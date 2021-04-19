import TonProviderFactory from "./TonProviderFactory";
import TonLogo32 from '../assets/ton_logo@18.png'
import RubyLogo32 from '../assets/ruby_logo@18.png'

const _networks = [
    {
        id: 1,
        name: 'Ton Crystal',
        short: 'TON',
        description: 'Main Ton Network',
        logo32: TonLogo32,
        color: '#36AAFB',
        accountExplorerUrl: (addr) => {
            return `https://ton.live/accounts/accountDetails?id=${addr}`
        },
        provider: TonProviderFactory.create(['main.ton.dev'])
    },
    {
        id: 2,
        name: 'Ton Ruby (Dev)',
        short: 'Ruby',
        description: 'Ton Rubin(Test) Network',
        logo32: RubyLogo32,
        color: '#DF116F',
        accountExplorerUrl: (addr) => {
            return `https://net.ton.live/accounts/accountDetails?id=${addr}`
        },
        provider: TonProviderFactory.create(['net.ton.dev'])
    }
];

const NetworksApi = {
    getNetworks() {
        return _networks;
    },

    getNetwork(id){
        return _networks.filter(nt => nt.id === id)[0];
    }
}


export default NetworksApi;