import React, { useState } from 'react';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import OpenInBrowserOutlinedIcon from '@material-ui/icons/OpenInBrowserOutlined';
import { createStyles, emphasize, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: 'absolute',
        right: theme.spacing(1),
        bottom: theme.spacing(1)
    },
    speedAction: {
        color: theme.palette.primary.contrastText,
        backgroundColor: emphasize(theme.palette.primary.main, 0.12),
        '&:hover': {
          backgroundColor: emphasize(theme.palette.primary.main, 0.15),
        },
        transition: `${theme.transitions.create('transform', {
          duration: theme.transitions.duration.shorter,
        })}, opacity 0.8s`,
        opacity: 1,
      }
}));

const SpeedAddWalletButton = (props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const actions = [
        { icon: <OpenInBrowserOutlinedIcon />, name: 'Import From Mnemonic', action: () => handleAction(props.onImport) },
        { icon: <AddBoxOutlinedIcon />, name: 'New Wallet', action: () => handleAction(props.onNew) },
    ];

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAction = (action) => {
        setOpen(false);

        if (action) {
            action();
        }

    }

    return (<>
        <SpeedDial
            className={classes.root}
            ariaLabel="Add Wallet"
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction='up'
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipPlacement="left-start"
                    className={classes.speedAction}
                    onClick={action.action}
                />
            ))}
        </SpeedDial>

    </>);
}

export default SpeedAddWalletButton;