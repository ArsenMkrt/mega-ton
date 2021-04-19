import { Box, FormControl, TextField, Typography, withStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";

const styles = (theme) => ({
    root: {
        
    },
    fieldBox: {
        margin: theme.spacing(3),
        textAlign: 'center'
    },
    margin: {
        marginTop: theme.spacing(1),
    },
});

class ValidateMnemonicStep extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            mnemonicWords: props.mnemonicWords.split(' '),
            choosenWords: {}
        };

    }

    componentDidMount() {
        if (!this.state.mnemonicWords)
            return;

        const validatingWordsCount = 3;

        const indexArray = [...Array(this.state.mnemonicWords.length).keys()];
        this.shuffleArray(indexArray);
        let choosenIndexes = indexArray.slice(0, validatingWordsCount).sort((w1, w2) => w1 - w2);

        const cw = {};
        choosenIndexes.forEach(w => cw[w] = {
            input: '',
            hasError: false
        });

        this.setState({
            choosenWords: cw
        });
    }

    async validate() {
        const wrds = { ...this.state.choosenWords };
        let hasError = false;

        Object.keys(wrds).forEach(wrd => {
            const cw = this._choosenWord(wrd);
            const index = parseInt(wrd);
            cw.hasError = cw.input !== this.state.mnemonicWords[index];
            hasError = hasError || cw.hasError;
        });

        this.setState({
            choosenWords: wrds
        });

        if (!hasError && this.props.onConfirm) {
            this.props.onConfirm();
        }

        return !hasError;
    }

    nth(d) {
        //d = parseInt(d);
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    handleWordInput(vw, value) {
        var cw = { ...this.state.choosenWords };
        cw[vw].input = value;
        if (cw[vw].hasError) {
            const index = parseInt(vw);
            cw[vw].hasError = cw[vw].input !== this.state.mnemonicWords[index];
        }
        this.setState({ choosenWords: cw });
    }

    _choosenWord(key) {
        return this.state.choosenWords[key];
    }

    _formatWordLabel(key) {
        const pos = parseInt(key) + 1;
        return `${pos}${this.nth(pos)}`;
    }

    _infoMessage() {
        return `Please enter ${Object.keys(this.state.choosenWords).map(vw => this._formatWordLabel(vw)).join(', ')} words from seed (previous speed)`;
    }

    render() {
        const { classes } = this.props;
        return (<Box className={classes.root}>
            <Alert severity="info">
                <AlertTitle>Let's make sure seed is stored</AlertTitle>
                {this._infoMessage()}
            </Alert>
            <Box className={classes.fieldBox}>
                <FormControl>
                    <Typography variant="h6" gutterBottom>Verify Seed</Typography>
                    {Object.keys(this.state.choosenWords).map((vw, i) => <TextField
                        key={i}
                        type="input"
                        label={`${this._formatWordLabel(vw)} word`}
                        variant="outlined"
                        size="small"
                        required
                        disabled={this.props.disabled}
                        className={classes.margin}
                        defaultValue={this._choosenWord(vw).input}
                        error={this._choosenWord(vw).hasError}
                        onChange={ev => this.handleWordInput(vw, ev.target.value)}
                    />)}
                </FormControl>
            </Box>
        </Box>);
    }
}

export default withStyles(styles)(ValidateMnemonicStep);