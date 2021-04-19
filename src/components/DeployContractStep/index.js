import { Box, MenuItem, TextField, Typography, withStyles } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Alert, AlertTitle, Skeleton } from '@material-ui/lab';
import React from 'react';
import WalletApi from '../../api/WalletApi';
import ConverterApi from '../../api/ConverterApi';

const styles = (theme) => ({
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
});

class DeployContractStep extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            availableContracts: [],
            selectedContract: { id: '' },
            totalFee: null,
        };

    }

    async validate() {
        let isValid = this.state.totalFee ? true : false;
        return isValid;
    }

    async componentDidMount() {
        if (!this.props.network)
            return;

        const contracts = await WalletApi.getSmartContracts(this.props.network);
        const fees = await WalletApi.calculateDeployFee(this.props.network, this.props.walletId, this.props.password);
        const decFee = ConverterApi.toDec(fees.fees.totalAccountFees);
        var totalFee = ConverterApi.getNanoWholeAndReminder(decFee);

        this.setState({
            availableContracts: contracts,
            selectedContract: contracts[0],
            totalFee: `${totalFee.whole}.${totalFee.reminder.substring(0, 4)}`
        });
    }

    render() {
        const { classes } = this.props;
        return (<Box className={classes.root}>
            <Alert severity="info">
                <AlertTitle>Deploy Wallet Contract</AlertTitle>
                In order to perform any transactions please deploy wallet contract into wallet address.
            </Alert>
            <Box className={classes.contractSelect}>
                <div className={classes.iconSection}>
                    <AccountBalanceWalletIcon fontSize="large" />
                </div>
                <TextField value={this.state.selectedContract.id} select disabled>
                    {this.state.availableContracts.map(sc => (
                        <MenuItem key={sc.id} value={sc.id}>
                            {sc.name}
                        </MenuItem>))}
                </TextField>
                {!this.state.totalFee ? <Skeleton className={classes.skeletonSection} width={120}></Skeleton>
                    : <Typography className={classes.feeSection}>Estimated Fee ≈ <strong>{this.state.totalFee}</strong></Typography>}
            </Box>
        </Box>);
    }
}

export default withStyles(styles)(DeployContractStep);