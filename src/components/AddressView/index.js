import React from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton, InputAdornment, makeStyles, TextField, Tooltip } from '@material-ui/core';
import copyToClipboard from '../../api/ClipboardApi';


const useStyles = makeStyles((theme) => ({
    root: {
        paddingRight: theme.spacing(2)
    },
    addressInput: {
        textOverflowMiddle: "ellipsis"
    }
}));

const AddressView = (props) => {
    const classes = useStyles();

    function shortenAddress(address) {
        return `${address?.substr(0, 9)}...${address?.substr(-8)}`;
    };

    function onExplore(ev) {
        if (!props.explorer) {
            return;
        }
        const url = props.explorer(props.wallet?.deployData?.address);
        window.open(url, "_blank");
    }

    return (
        <div className={classes.root}>
            {/* <a href='#'>explore</a> */}
            <TextField
                label={props.wallet?.name ?? 'Address'}
                fullWidth
                // variant="standard"
                disabled
                className={classes.addressInput}
                value={shortenAddress(props.wallet?.deployData?.address)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <Tooltip title="Copy Address">
                            <IconButton aria-label="copy"
                                size="small"
                                onClick={() => copyToClipboard(props.wallet?.deployData?.address)}>
                                <FileCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Explore Account">
                            <span>
                                <IconButton aria-label="copy"
                                    size="small"
                                    disabled={(props.wallet?.balance === '0') && (props.wallet?.codeHash ? false : true)}
                                    onClick={onExplore}>
                                    <ExitToAppIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </InputAdornment>,
                }}
            />
        </div>
    );
}

export default AddressView;