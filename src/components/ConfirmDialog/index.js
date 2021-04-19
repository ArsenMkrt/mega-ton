import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';

const ConfirmDialog = (props) => {
    const { onCancel, onConfirm, open } = props;
    
    const handleCancel = () => {
        if (onCancel) { 
            onCancel(); 
        }
    }

    const handleConfirm = () => {
        if (onConfirm) { onConfirm(); }
    }

    return (
        <Dialog open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} autoFocus>{props.cancelButtonText ?? 'Cancel'}</Button>
                <Button onClick={handleConfirm} color="primary">{props.confirmButtonText ?? 'Confirm'}</Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDialog.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string,
    confirmButtonText: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    open: PropTypes.bool.isRequired
};

export default ConfirmDialog;
