import { Box, debounce, FormControl, FormHelperText, TextField, Typography, withStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import ConverterApi from '../../api/ConverterApi';
import WalletApi from '../../api/WalletApi';

const styles = (theme) => ({
    root: {
        textAlign: "center",
        marginTop: theme.spacing(3)
    },
    form: {
        textAlign: "center",
        marginTop: theme.spacing(1)
    },
    textField: {
        marginBottom: theme.spacing(1)
    },
    balanceSection: {
        color: theme.palette.text.hint,
        textAlign: 'left',
        margin: 1
    },
    feeSection: {
        color: theme.palette.text.hint,
        textAlign: 'left',
        margin: 1
    }
});

class SendTokensStep extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            isAddressInvalid: false,
            ammount: '',
            isAmmountInvalid: false,
            errorMessage: '',
            comment: '',
            originalBalance: null,
            balance: '',
            totalFee: '0.0175'
        };

        this.delayedRecalculateFee = debounce(async q => await this.recalculateFee(), 1000);
    }

    async validate() {
        let hasError = false;
        if (!this.state.address) {
            this.setState({
                isAddressInvalid: true,
                errorMessage: 'Address is required'
            });
            hasError = true;
        }

        if (!this.state.ammount || isNaN(this.state.ammount)) {
            this.setState({
                isAmmountInvalid: true,
                errorMessage: this.state.errorMessage ?? 'Ammount should be number'
            });
            hasError = true;
        }

        return !hasError;
    }

    async componentDidMount() {
        if (!this.props.walletId || !this.props.network)
            return;

        const accountData = await WalletApi.getAccountData(this.props.network, this.props.walletId);
        const balance = accountData?.balance;
        if (!balance)
            return;

        const balanceParts = ConverterApi.getNanoWholeAndReminder(balance);

        this.setState({
            balance: `${balanceParts.whole}.${balanceParts.reminder.substring(0, 3)}`
        });
    }

    handleAddressChange(value) {
        this.setState({
            address: value
        });

        if (this.props.onAddressChange) {
            this.props.onAddressChange(value);
        }

        this.delayedRecalculateFee();
    }

    handleAmmountChange(value) {
        this.setState({
            ammount: value
        });

        if (this.props.onAmmountChange) {
            this.props.onAmmountChange(value);
        }

        this.delayedRecalculateFee();
    }

    handleCommentChange(value) {
        this.setState({
            comment: value
        });

        if (this.props.onCommentChange) {
            this.props.onCommentChange(value);
        }

        this.delayedRecalculateFee();
    }

    async recalculateFee() {
        if (!this.state.address || !this.state.ammount){
            return;
        }

        try {
            const fee = await WalletApi.calculateTransactionFee(this.props.network, 
                this.props.walletId, 
                this.props.password, 
                this.state.address, 
                this.state.ammount,
                this.state.comment);
            
            const totalFee = fee?.fees?.totalAccountFees;
            if (!totalFee)
                return;
            const totalFeeParts = ConverterApi.getNanoWholeAndReminder(ConverterApi.toDec(totalFee));
            
            this.setState({
                totalFee: `${totalFeeParts.whole}.${totalFeeParts.reminder.substring(0,4)}`
            });

        }
        catch(ex)
        {
            console.error(ex);
        }
        
    }

    render() {
        const { classes } = this.props;

        return (<Box className={classes.root}>
            <Typography variant="h6" gutterBottom>Send Tokens</Typography>
            <FormControl className={classes.form} error={this.state.isAddressInvalid || this.state.isAmmountInvalid}>
                <TextField label="Address"
                    required
                    error={this.state.isAddressInvalid}
                    defaultValue={this.state.address}
                    onChange={ev => this.handleAddressChange(ev.target.value)} />
                {this.state.balance
                    ? <Typography className={classes.balanceSection}>Balance: <strong>{this.state.balance}</strong></Typography>
                    : <Skeleton><Typography className={classes.balanceSection}>Balance:</Typography></Skeleton>}

                <TextField label="Ammount"
                    required
                    className={classes.textField}
                    type="number"
                    error={this.state.isAmmountInvalid}
                    defaultValue={this.state.ammount}
                    onChange={ev => this.handleAmmountChange(ev.target.value)} />
                <TextField label="Comment"
                    multiline
                    defaultValue={this.state.comment}
                    onChange={ev => this.handleCommentChange(ev.target.value)}
                    rows={3} />
                {this.state.totalFee
                    ? <Typography className={classes.feeSection}>Estimated Fee ≈ <strong>{this.state.totalFee}</strong></Typography>
                    : <Skeleton><Typography className={classes.feeSection}>Estimated Fee ≈</Typography></Skeleton>}
                <FormHelperText>{this.state.errorMessage}</FormHelperText>
            </FormControl>
        </Box>);
    }

}

export default withStyles(styles)(SendTokensStep);