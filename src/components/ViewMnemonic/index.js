import { Box, FormControl, IconButton, InputAdornment, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import copyToClipboard from '../../api/ClipboardApi';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    mnemonicBox: {
        margin: theme.spacing(3),
        textAlign: 'center'
    }
}));

const ViewMnemonic = (props) => {
    const classes = useStyles();

    return (<Box className={classes.root}>
        <Alert severity="warning">
            <AlertTitle>Keep seed words in a safe place</AlertTitle>
            Losing seed phrase is equivalent to losing all your funds.
        </Alert>
        <Box className={classes.mnemonicBox}>
            <FormControl>
                <Typography variant="h6" gutterBottom>Seed Words</Typography>
                {!props.mnemonicWords
                    ? (<Skeleton><TextField rows={5} multiline fullWidth /></Skeleton>)
                    : (<TextField
                        aria-label="Mnemonic Words"
                        variant="outlined"
                        rows={5}
                        multiline
                        fullWidth
                        disabled
                        value={props.mnemonicWords}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Tooltip title="Copy Words">
                                    <IconButton aria-label="copy" className="copy-button" onClick={() => copyToClipboard(props.mnemonicWords)}>
                                        <FileCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>,
                        }} />)}
            </FormControl>
        </Box>
    </Box>);
}

export default ViewMnemonic;