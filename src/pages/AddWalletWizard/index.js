import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import withMainLayout from '../MainLayout';
import { CircularProgress } from '@material-ui/core';
import NetworksApi from '../../api/NetworkApi';
import AskMasterPasswordStep from '../../components/AskMasterPasswordStep';
import GenerateMnemonicStep from '../../components/GenerateMnemonicStep';
import ValidateMnemonicStep from '../../components/ValidateMnemonicStep';
import WalletApi from '../../api/WalletApi';
import Navigation from '../../api/NavigationApi';
import MultiformSteper from '../../components/MultiformSteper';

const useStyles = makeStyles(theme => ({
    marginRight: {
        marginRight: theme.spacing(1) / 2
    },
    buttonProgress: {
        color: 'white',
        marginRight: theme.spacing(1) / 2
    }
}));



const AddWalletWizard = (props) => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [network, setNetwork] = useState();

    const [password, setPassword] = useState('');
    const [mnemonicWords, setMnemonicWords] = useState();

    const [isWalletCreating, setIsWalletCreating] = useState(false);

    const askPasswordRef = useRef(null);
    const generateMnemonicRef = useRef(null);
    const validateMnemonicRef = useRef(null);

    useEffect(() => {
        var networkId = props.history.location.state.networkId;
        var network = NetworksApi.getNetwork(networkId);
        setNetwork(network);

    }, [props.history.location.state.networkId]);

    const handleMnemonicWordsChange = async (seed) => {
        setMnemonicWords(seed);
    };

    const steps = [
        <AskMasterPasswordStep ref={askPasswordRef}
                                password={password}
                                onConfirm={setPassword} />,
        <GenerateMnemonicStep ref={generateMnemonicRef}
                                network={network}
                                mnemonicWords={mnemonicWords}
                                onMnemonicWordsChange={handleMnemonicWordsChange} />,
        <ValidateMnemonicStep ref={validateMnemonicRef}
                                mnemonicWords={mnemonicWords} />
    ];

    const handleAskPasswordNext = async () => {
        var isValid = await askPasswordRef.current.validate();
        if (!isValid)
            return;

        setActiveStep(prevActiveStep => {
            return prevActiveStep + 1
        });
    };

    const handleGenerateMnemonicNext = async () => {
        const isMnemonicValid = await generateMnemonicRef.current.validate();
        if (!isMnemonicValid)
            return;

        setActiveStep(prevActiveStep => {
            return prevActiveStep + 1
        });
    };

    const handleCreateWalletNext = async () => {
        const validateMnemonic = await validateMnemonicRef.current.validate();
        if (!validateMnemonic)
            return;

        setIsWalletCreating(true);
        await WalletApi.createWallet(network, mnemonicWords, password);
        setIsWalletCreating(false);

        Navigation.goToWalletList(props.history);
    };

    const handleBack = () => {
        if (activeStep === 0 || activeStep === 1) {
            Navigation.goToWalletList(props.history);
            return;
        }

        setActiveStep((prevActiveStep) => {
            return prevActiveStep - 1;
        });
    };

    const renderNextButton = (activeStep) => {
        if (activeStep === 0)
            return (<Button onClick={handleAskPasswordNext} color="primary">
                Next <KeyboardArrowRight />
            </Button>);
        if (activeStep === 1)
            return (<Button onClick={handleGenerateMnemonicNext} color="primary" disabled={mnemonicWords ? false : true}>
                Next <KeyboardArrowRight />
            </Button>);

        if (activeStep === 2)
            return (<Button onClick={handleCreateWalletNext} color="primary" disabled={isWalletCreating}>
                {isWalletCreating
                    ? <CircularProgress size={16} className={classes.marginRight} />
                    : <AccountBalanceWalletIcon fontSize='small' className={classes.marginRight} />} Create
            </Button>);
    };

    const renderBackButton = (activeStep) => {
        return (<Button onClick={handleBack} disabled={isWalletCreating}>
            <KeyboardArrowLeft /> Back
        </Button>);
    }

    return MultiformSteper(steps.length, activeStep, cs => steps[cs], renderNextButton, renderBackButton);
}

export default withMainLayout(AddWalletWizard);