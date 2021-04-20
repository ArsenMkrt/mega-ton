import { Box, createStyles, makeStyles } from "@material-ui/core";
import withWalletListLayout from "./walletListLayout";
import withMainLayout from "../MainLayout";
import { useEffect, useState } from "react";
import WalletApi from "../../api/WalletApi";
import WalletCard from "../../components/WalletCard";
import ConfirmDelete from "../../components/ConfirmDelete";
import Navigation from "../../api/NavigationApi";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        overflowY: 'auto',
        marginTop: theme.spacing(2),
        maxHeight: 390,

    },

    snackbar: {
        [theme.breakpoints.up('xs')]: {
            bottom: 90,
        },
    },
    scrollPanel: {
        paddingBottom: 70
    }
}));

const WalletListPage = (props) => {
    const classes = useStyles();

    const [wallets, setWallets] = useState();    
    const [walletSubscribtionData, setWalletSubscribtionData] = useState({network: null, wallets: null});

    const [deletingWallet, setDeletingWallet] = useState(null);

    useEffect(() => {
        async function loadWallets(){
            const wlts = await WalletApi.getWallets();
            setWallets(wlts);
            const subData = {
                network: props.network,
                wallets: wlts
            };
            setWalletSubscribtionData(subData);
        };
        loadWallets();
    }, [props.network]);

    useEffect(() => {
        if (!walletSubscribtionData || !walletSubscribtionData.network || !walletSubscribtionData.wallets)
            return;

        const unsubPromise = WalletApi.subscribeAccountChange(walletSubscribtionData.network, walletSubscribtionData.wallets, (change) => {
            setWallets(prevWallets => {
                if (!prevWallets)
                    return prevWallets;

                const allMatches = walletSubscribtionData.wallets
                    .map((wlt, index) => { return { wlt, index } })
                    .filter(item => item.wlt?.deployData?.address === change.address);

                if (!allMatches)
                    return prevWallets;

                const wltListClone = [...prevWallets];
                allMatches.forEach(element => {
                    const index = element.index;
                    const wltClone = {
                        ...element.wlt
                    };

                    if (change.hasOwnProperty('balance')) {
                        wltClone.balance = change.balance;
                    }

                    if (change.hasOwnProperty('codeHash')) {
                        wltClone.codeHash = change.codeHash;
                    }

                    wltListClone[index] = wltClone;
                });

                return wltListClone;
            });
        });

        return () => {
            unsubPromise.then(us => us()); 
        }

    }, [walletSubscribtionData]);

    const reloadWallets = async () => {
        const wlts = await WalletApi.getWallets();
        setWallets(wlts);
        const subData = {
            network: props.network,
            wallets: wlts
        };
        setWalletSubscribtionData(subData);
    };

    const onConfirmWalletDelete = async () => {
        await WalletApi.deleteWallet(deletingWallet.id);
        await reloadWallets();
        setDeletingWallet(null);

        props.snackbar.showSuccess('Wallet Deleted!');
    };

    const handleSendTokens = (wallet) => {
        Navigation.goToSendTokens(props.history, props.network, wallet);
    }


    return (
        <Box className={classes.root}>
            <Box className={classes.scrollPanel}>
                {wallets?.map((wallet, index) => <WalletCard key={index}
                    network={props.network}
                    wallet={wallet}
                    onSendTokens={()=>handleSendTokens(wallet)}
                    onDelete={()=>setDeletingWallet(wallet)} />)}
            </Box>

            <ConfirmDelete open={deletingWallet ? true : false}
                            message={'Delete Wallet from list?'}
                            onCancel={() => setDeletingWallet(null)}
                            onConfirm={() => onConfirmWalletDelete()} />
        </Box>);
}

export default withMainLayout(withWalletListLayout(WalletListPage));