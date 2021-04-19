import React from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../ConfirmDialog';

const ConfirmDelete = (props) => {

    return (
        <ConfirmDialog open={props.open}
            title={props.title ?? 'Delete'}
            message={props.message}
            cancelButtonText={props.cancelButtonText ?? 'Cancel'}
            confirmButtonText={props.confirmButtonText ?? 'Delete'}
            onConfirm={props.onConfirm}
            onCancel={props.onCancel} />
    );
}

ConfirmDelete.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string,
    confirmButtonText: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    open: PropTypes.bool.isRequired
};

export default ConfirmDelete;
