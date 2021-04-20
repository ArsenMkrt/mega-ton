import { Box, createStyles, makeStyles, Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState } from "react";

const useStyles = makeStyles((theme) => createStyles({
    header: {
        background: theme.header.background,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    brandname: {
        color: theme.header.brandColor,
        fontWeight: 'bold'
    },
    slogan: {
        color: theme.header.sloganColor
    },
    contentBox: {
        minHeight: 384,
        minWidth: 300,
        position: 'relative'
    },
    snackbar: {
        [theme.breakpoints.up('xs')]: {
            bottom: 90,
        },
    }
}));


const withMainLayout = (ContentComponent) => {
    return (props) => {
        const classes = useStyles();

        const [snack, setSnack] = useState({
            open: false,
            severity: '',
            message: ''
        });

        const snackbar = {
            show(message, severity) {
                setSnack({
                    open: true,
                    severity: severity,
                    message: message
                });
            },

            showSuccess(message) {
                this.show(message, 'success');
            },

            showInfo(message) {
                this.show(message, 'info');
            },

            showWarning(message) {
                this.show(message, 'warning');
            },

            showError(message) {
                this.show(message, 'error');
            },

            close() {
                setSnack({
                    open: false,
                    severity: 'info',
                    message: ''
                });
            }
        };
        
        return (<Box className={classes.root}>
            <Box className={classes.header}>
                <Typography variant="h4" className={classes.brandname}>MegaTon</Typography>
                <Typography variant="caption" className={classes.slogan}>Free and Secure Ton Wallet</Typography>
            </Box>
            <Box className={classes.contentBox}>
                <ContentComponent {...props} snackbar={snackbar} />
            </Box>
            <Snackbar className={classes.snackbar} open={snack.open} autoHideDuration={6000} onClose={snackbar.close}>
                <Alert severity={snack.severity} onClose={snackbar.close}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
        );
    }
}

export default withMainLayout;