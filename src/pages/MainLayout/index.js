import { Box, createStyles, makeStyles, Typography } from "@material-ui/core";

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
    }
}));


const withMainLayout = (ContentComponent) => {
    return (props) => {
        const classes = useStyles();

        return (<Box className={classes.root}>
            <Box className={classes.header}>
                <Typography variant="h4" className={classes.brandname}>MegaTon</Typography>
                <Typography variant="caption" className={classes.slogan}>Free and Secure Ton Wallet</Typography>
            </Box>
            <Box className={classes.contentBox}>
                <ContentComponent {...props} />
            </Box>
        </Box>
        );
    }
}

export default withMainLayout;