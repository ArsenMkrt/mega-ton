import { Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import SetMasterPassword from '../../components/SetMasterPassword';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Navigation from '../../api/NavigationApi';
import withMainLayout from '../MainLayout';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        textAlign: "center",
        marginTop: theme.spacing(6)
    }
}));

const WelcomePage = (props) => {
    const classes = useStyles();
    const onMasterPassswordSet = () => {
        Navigation.goToWalletList(props.history);
    };

    return (<>
        <Alert severity="info">
            <AlertTitle>Set Master Password</AlertTitle>
            Password is used to encrypt keys
        </Alert>
        <Box className={classes.root}>
            <SetMasterPassword onConfirm={onMasterPassswordSet} />
        </Box>
    </>);

}

export default withMainLayout(WelcomePage);