import { Box, createStyles, makeStyles } from "@material-ui/core"
import { useState } from "react"
import Navigation from "../../api/NavigationApi";
import SelectNetworkDropDown from "../../components/SelectNetworkDropDown"
import SpeedAddWalletButton from "../../components/SpeedAddWalletButton"

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: theme.spacing(1),
        background: '#f5f5f5',
        position: 'relative',
        minHeight: '367px'
    },
    actionSectionStyle: {
        margin: theme.spacing(1),
        float: 'right',
        position: 'absolute',
        right: 0,
        bottom: 0
    }
}));


const withWalletListLayout = (WalletListContent) => {
    return (props) => {
        const classes = useStyles();
        const [network, setNetwork] = useState();

        const onNewWallet = () => {
            Navigation.goToNewWallet(props.history, network);
        };

        const onImportWallet = () => {
            Navigation.goToImportWallet(props.history, network);
        };

        return (<Box className={classes.root}>
            <SelectNetworkDropDown onNetworkChanged={setNetwork} />
            <WalletListContent {...props} network={network} />
            <Box className={classes.actionSectionStyle}>
                <SpeedAddWalletButton history={props.history} onNew={onNewWallet} onImport={onImportWallet} />
            </Box>

        </Box>)
    }
}

export default withWalletListLayout;