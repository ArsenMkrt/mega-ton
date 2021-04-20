import { useState } from "react";
import { Button, createStyles, FormControl, FormHelperText, makeStyles, TextField, Typography } from "@material-ui/core";
import WalletApi from "../../api/WalletApi";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        marginTop: theme.spacing(1) + 1
    }
}));

const SetMasterPassword = (props) => {
    const classes = useStyles();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSetPassword = async () => {
        setErrorMessage('');

        if (!password) {
            setErrorMessage('Password is required!');
            return;
        }
        else if (password.length < 6) {
            setErrorMessage('Password length should be at least 6!');
            return;
        } else if (password !== confirmPassword) {
            setErrorMessage('Password and Confirmation does not match!');
            return;
        }

        await WalletApi.setMasterPassword(password);

        if (props.onConfirm)
            props.onConfirm();
    };

    return <FormControl error={errorMessage ? true : false}>
        <Typography variant="h6" gutterBottom>Master Password</Typography>
        <TextField
            type="password"
            label="Master Password"
            required
            error={errorMessage ? true : false}
            onChange={ev => setPassword(ev.target.value)} />
        <TextField id="confirm-password"
            type="password"
            label="Confirm Password"
            className={classes.root}
            required
            error={errorMessage ? true : false}
            onChange={ev => setConfirmPassword(ev.target.value)} />
        <FormHelperText>{errorMessage}</FormHelperText>
        <div>
            <Button variant="contained"
                className={classes.root}
                color="primary"
                onClick={onSetPassword}>Create</Button>
        </div>
    </FormControl>
}

export default SetMasterPassword;