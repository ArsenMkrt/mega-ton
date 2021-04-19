import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import withMainLayout from '../MainLayout';
import { CircularProgress } from '@material-ui/core';
import WalletApi from '../../api/WalletApi';
import NetworksApi from '../../api/NetworkApi';
import Navigation from '../../api/NavigationApi';
import AskMasterPasswordStep from '../../components/AskMasterPasswordStep';
import MultiFormSteper from '../../components/MultiformSteper';
import InputMnemonicStep from '../../components/InputMnemonicStep';

const useStyles = makeStyles(theme => ({
    steeper: {
        position: 'absolute',
        width: '95%',
        bottom: 0
    },
    marginRight: {
        marginRight: theme.spacing(1) / 2
    },
    buttonProgress: {
        color: 'white',
        marginRight: theme.spacing(1) / 2
    }
}));

const ImportWalletWizard = (props) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [network, setNetwork] = useState();

    const [password, setPassword] = useState('');
    const [mnemonicWords, setMnemonicWords] = useState('');

    const [isWalletImporting, setIsWalletImporting] = useState(false);

    const askPasswordRef = useRef(null);
    const inputMnemonicRef = useRef(null);

    useEffect(() => {
        var networkId = props.history.location.state.networkId;
        var network = NetworksApi.getNetwork(networkId);
        setNetwork(network);
    }, [props.history.location.state.networkId]);

    const steps = [
        <AskMasterPasswordStep ref={askPasswordRef}
            password={password}
            onConfirm={setPassword} />,
        <InputMnemonicStep ref={inputMnemonicRef}
            mnemonicWords={mnemonicWords}
            onMnemonicValidated={setMnemonicWords} />
    ];

    const handleAskPasswordNext = async () => {
        var isValid = await askPasswordRef.current.validate();
        if (!isValid)
            return;

        setActiveStep(prevActiveStep => {
            return prevActiveStep + 1
        });
    };

    const handleImportWalletNext = async () => {
        var isValid = await inputMnemonicRef.current.validate();
        if (!isValid)
            return;

        setIsWalletImporting(true);
        await WalletApi.createWallet(network, mnemonicWords, password);

        setIsWalletImporting(false);
        Navigation.goToWalletList(props.history);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === 0 || prevActiveStep === 1) {
                Navigation.goToWalletList(props.history);
                return;
            }
            return prevActiveStep - 1;
        });
    };

    const renderNextButton = (activeStep) => {
        if (activeStep === 0)
            return (<Button onClick={handleAskPasswordNext} color="primary">
                Next <KeyboardArrowRight />
            </Button>);

        if (activeStep === 1)
            return (<Button onClick={handleImportWalletNext} color="primary" disabled={isWalletImporting}>
                {isWalletImporting
                    ? <CircularProgress size={16} className={classes.marginRight} />
                    : <AccountBalanceWalletIcon fontSize='small' className={classes.marginRight} />} Import
            </Button>);
    };

    const renderBackButton = (activeStep) => {
        return (<Button onClick={handleBack} disabled={isWalletImporting}>
            <KeyboardArrowLeft /> Back
        </Button>);
    }

    return MultiFormSteper(steps.length, activeStep, cs => steps[cs], renderNextButton, renderBackButton);
}

export default withMainLayout(ImportWalletWizard);