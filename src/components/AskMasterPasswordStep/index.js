import { Box, FormControl, FormHelperText, TextField, Typography, withStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import WalletApi from "../../api/WalletApi";

const styles = (theme) => ({
    passwordBox: {
        margin: theme.spacing(3),
        marginTop: theme.spacing(6),
        textAlign: 'center'
    }
});

class AskMasterPasswordStep extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            password: props.password
        };

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    async validate(){
        const isPassValid = await WalletApi.validateMasterPassword(this.state.password);
        const msg = isPassValid ? '' : 'Password is not valid';
        this.setState({
            errorMessage: msg
        });

        if (isPassValid && this.props.onConfirm){
            this.props.onConfirm(this.state.password);
        }

        return isPassValid;
    }

    handlePasswordChange(value) {
        this.setState({
            password: value
        });
    }

    render() {
        const { classes } = this.props;
        return (<Box className={classes.root}>
            <Alert severity="info">
                MegaTon uses master password to decrypt secrets
            </Alert>
            <Box className={classes.passwordBox}>
                <FormControl error={this.state.errorMessage ? true : false}>
                    <Typography variant="h6" gutterBottom>Master Password</Typography>
                    <TextField id="master-password"
                        type="password"
                        label="Master Password"
                        variant="outlined"
                        size="small"
                        required
                        onChange={ev => this.handlePasswordChange(ev.target.value)}
                        defaultValue={this.state.password}
                        error={this.state.errorMessage ? true : false} />
                    <FormHelperText>{this.state.errorMessage}</FormHelperText>
                </FormControl>
            </Box>
        </Box>);
    }
}

export default withStyles(styles)(AskMasterPasswordStep);