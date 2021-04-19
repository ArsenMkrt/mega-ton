import { Box, FormControl, TextField, Typography, withStyles } from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import React from "react";
import WalletApi from "../../api/WalletApi";

const styles = (theme) => ({
    root: {
    },
    mnemonicBox: {
        margin: theme.spacing(2),
        textAlign: 'center'
    }
});

class GenerateMnemonicStep extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mnemonicWords: props.mnemonicWords
        };

        this.handleMnemonicWordsChange = this.handleMnemonicWordsChange.bind(this);
    }

    handleMnemonicWordsChange(value) {
        this.setState({ mnemonicWords: value });
    }

    async componentDidMount() {
        if (this.state.mnemonicWords)
            return;
        
        const mnemonic = await WalletApi.generateMnemonic(this.props.network);
        this.setState({
            mnemonicWords: mnemonic
        });

        if (mnemonic && this.props.onMnemonicWordsChange) {
            this.props.onMnemonicWordsChange(mnemonic);
        }
    }

    async validate() {
        return this.state.mnemonicWords ? true : false;
    }

    render() {
        const { classes } = this.props;
        return (<Box className={classes.root}>
            <Alert severity="warning">
                <AlertTitle><strong>Important!!</strong></AlertTitle>
                Keep seed words in a safe place. Losing seed phrase is equivalent to losing all your funds.
            </Alert>
            <Box className={classes.mnemonicBox}>
                <FormControl>
                    <Typography variant="h6" gutterBottom>Seed Words</Typography>
                    {!this.state.mnemonicWords
                        ? (<Skeleton><TextField rows={5} multiline fullWidth /></Skeleton>)
                        : (<TextField
                            aria-label="Mnemonic Words"
                            variant="outlined"
                            rows={5}
                            multiline
                            fullWidth
                            disabled
                            defaultValue={this.state.mnemonicWords}
                            onChange={ev => this.handleMnemonicWordsChange(ev.target.value)}
                            />)}
                </FormControl>
            </Box>
        </Box>);
    }
}

export default withStyles(styles)(GenerateMnemonicStep);