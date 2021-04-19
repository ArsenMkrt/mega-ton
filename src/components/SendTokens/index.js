import { Box, FormControl, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import ConverterApi from '../../api/ConverterApi';
import WalletApi from '../../api/WalletApi';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        textAlign: "center",
        marginTop: theme.spacing(3)
    },
    form: {
        textAlign: "center",
        marginTop: theme.spacing(1)
    },
    textField: {
        marginTop: theme.spacing(1)
    },
    feeSection: {
        margin: theme.spacing(1),
        color: theme.palette.text.hint
    }
}));

const SendTokens = (props) => {
    const classes = useStyles();
    const [totalFee, setTotalFee] = useState('0.0175');
    
    const onFeeInputBlur = async () => {
        if (!props.network || !props.walletId || props.password == null || !props.address || !props.ammount)
            return;

        const fees = await WalletApi.calculateTransactionFee(props.network, props.walletId, props.password, props.address, props.ammount);
        if (!fees.fees || fees.fees.totalAccountFees == null)
            return;
        const decFee = ConverterApi.toDec(fees.fees.totalAccountFees);
        var totalFee = ConverterApi.getNanoWholeAndReminder(decFee);

        setTotalFee(`${totalFee.whole}.${totalFee.reminder.substring(0, 4)}`);
    };

    const handleChange = (callback, value) => {
        if (callback)
            callback(value);
    };
    
    return (<Box className={classes.root}>
        <Typography variant="h6" gutterBottom>Send Tokens</Typography>
        <FormControl className={classes.form}>
            <TextField label="Address" 
                        className={classes.textField}
                        defaultValue={props.address}
                        onChange={ev => handleChange(props.onAddressChange, ev.target.value)}
                        onBlur={onFeeInputBlur}/>          
            <TextField label="Ammount" 
                        className={classes.textField} 
                        type="number"
                        defaultValue={props.ammount}
                        onChange={ev => handleChange(props.onAmmountChange, ev.target.value)}
                        onBlur={onFeeInputBlur} />
            {/* <TextField label="Comment" className={classes.textField} multiline rows={4} /> */}
            <Typography className={classes.feeSection}>Estimated Fee ≈ <strong>{totalFee}</strong></Typography>
        </FormControl>
    </Box>);

}

export default SendTokens;