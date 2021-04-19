import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const WalletMoreVertMenu = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onDeleteClicked = () => {
        if (props.onDelete) {
            props.onDelete();
        }
        handleClose();
    }

    return (
        <>
            <IconButton
                aria-label="More"
                aria-controls="More Wallet"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={onDeleteClicked}>Delete</MenuItem>
            </Menu>
        </>
    );
}

export default WalletMoreVertMenu;