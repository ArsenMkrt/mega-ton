import { Box, FormControl, FormHelperText, TextField, Typography, withStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";

const styles = (theme) => ({
    root: {
    },
    mnemonicBox: {
        margin: theme.spacing(3),
        textAlign: 'center'
    },
    wordsCount: {
        marginTop: theme.spacing(1),
        color: theme.palette.text.hint
    }
});

class InputMnemonicStep extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            mnemonicWords: props.mnemonicWords
        };

        this.handleMnemonicChange = this.handleMnemonicChange.bind(this);
    }

    async validate() {
        const isValid = this._isPhraseValid(this.state.mnemonicWords);
        return isValid;
    }

    _wordCount(seed) {
        return seed?.split(' ').map(w => w.trim()).filter(w => w).length ?? 0;
    }

    _isPhraseValid(seed){
        // Todo: take this numbers from network
        const wCount = this._wordCount(seed);

        const msg = wCount === 12 || wCount === 24 ? '' : 'Seed phrase should be 12 or 24 words length';
        this.setState({
            errorMessage: msg
        });
        
        return msg ? false : true;
    }

    handleMnemonicChange(value){
        this.setState({
            mnemonicWords: value
        });

        if (this.state.errorMessage){
            this._isPhraseValid(value);
        }

        if (this.props.onMnemonicValidated) {
            this.props.onMnemonicValidated(value);
        }
    }

    render() {
        const { classes } = this.props;

        return (<Box className={classes.root}>
            <Alert severity="info">
                <AlertTitle>Please enter seed words</AlertTitle>
                It is always possible to restore wallet using seed words.
            </Alert>
            <Box className={classes.mnemonicBox}>
                <FormControl error={this.state.errorMessage ? true : false}>
                    <Typography variant="h6" gutterBottom>Seed Words</Typography>
                    <TextField
                        aria-label="Mnemonic Words"
                        variant="outlined"
                        rows={5}
                        multiline
                        fullWidth
                        required
                        error={this.state.errorMessage ? true : false}
                        onChange={ev => this.handleMnemonicChange(ev.target.value)}
                        defaultValue={this.state.mnemonicWords} />
                    <small className={classes.wordsCount}>{`${this._wordCount(this.state.mnemonicWords)} words entered`}</small>
                    <FormHelperText>{this.state.errorMessage}</FormHelperText>
                </FormControl>
            </Box>
        </Box>);
    }
}

export default withStyles(styles)(InputMnemonicStep);