import { Box, MenuItem, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Alert, AlertTitle, Skeleton } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import WalletApi from '../../api/WalletApi';
import ConverterApi from '../../api/ConverterApi';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        //textAlign: "center",
    },
    iconSection: {
        margin: theme.spacing(1),
        color: theme.palette.text.hint
    },
    feeSection: {
        margin: theme.spacing(1),
        color: theme.palette.text.hint
    },
    skeletonSection: {
        margin: 'auto'
    },
    contractSelect: {
        textAlign: "center",
        marginTop: theme.spacing(3)
    },
    actionSection: {
        textAlign: "center",
        marginTop: theme.spacing(3)
    }
}));

const DeployContract = (props) => {
    const classes = useStyles();

    const [availableContracts, setAvailableContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState({id: ''});
    const [totalFee, setTotalFee] = useState();

    useEffect(() => {
        if (!props.network)
            return;
        
        async function loadContracts() {
            const contracts = await WalletApi.getSmartContracts(props.network);
            setAvailableContracts(contracts);
            setSelectedContract(contracts[0]);
        };

        loadContracts();
    }, [props.network]);

    useEffect(()=>{
        const walletId = props.walletId;
        if (!props.network || !props.walletId || !selectedContract.id)
            return;

        async function loadFee()
        {
            const fees = await WalletApi.calculateDeployFee(props.network, walletId, props.password);
            if (!fees.fees || fees.fees.totalAccountFees == null)
                return;
            const decFee = ConverterApi.toDec(fees.fees.totalAccountFees);
            var totalFee = ConverterApi.getNanoWholeAndReminder(decFee);
            setTotalFee(`${totalFee.whole}.${totalFee.reminder.substring(0, 4)}`);
        }

        loadFee();

    }, [props.network, selectedContract, props.walletId, props.password]);

    return (<Box className={classes.root}>
        <Alert severity="info">
            <AlertTitle>Deploy Wallet Contract</AlertTitle>
            In order to perform any transactions please deploy wallet contract into wallet address.
        </Alert>
        <Box className={classes.contractSelect}>
            <div className={classes.iconSection}>
                <AccountBalanceWalletIcon fontSize="large" />
            </div>
            <TextField value={selectedContract.id} select disabled>
                {availableContracts.map(sc => (
                    <MenuItem key={sc.id} value={sc.id}>
                        {sc.name}
                    </MenuItem>))}
            </TextField>
            {!totalFee ? <Skeleton className={classes.skeletonSection} width={120}></Skeleton>
                       : <Typography className={classes.feeSection}>Estimated Fee ≈ <strong>{totalFee}</strong></Typography>}
        </Box>
    </Box>);
}

export default DeployContract;