import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import withMainLayout from '../MainLayout';
import { CircularProgress } from '@material-ui/core';
import WalletApi from '../../api/WalletApi';
import NetworksApi from '../../api/NetworkApi';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SendIcon from '@material-ui/icons/Send';
import Navigation from '../../api/NavigationApi';
import MultiFormSteper from '../../components/MultiformSteper';
import AskMasterPasswordStep from '../../components/AskMasterPasswordStep';
import DeployContractStep from '../../components/DeployContractStep';
import SendTokensStep from '../../components/SendTokensStep';

const useStyles = makeStyles(theme => ({
    steeper: {
        position: 'absolute',
        width: '95%',
        bottom: 0
    },
    marginRight: {
        marginRight: theme.spacing(1) / 2
    },
    marginLeft: {
        marginLeft: theme.spacing(1) / 2
    },
    buttonProgress: {
        color: 'white',
        marginRight: theme.spacing(1) / 2
    }
}));

const SendTokensWizard = (props) => {
    const classes = useStyles();
    const [network, setNetwork] = useState();

    const [activeStep, setActiveStep] = useState(0);
    const [needDeploy, setNeedDeploy] = useState(false);

    const [password, setPassword] = useState('');

    const [isWalletDeploying, setIsWalletDeploying] = useState(false);

    const [sendingAmmount, setSendingAmmount] = useState();
    const [destinationAddress, setDestinationAddress] = useState();
    const [comment, setComment] = useState();
    const [isTokensSending, setIsTokensSending] = useState(false);

    const askPasswordRef = useRef(null);
    const deployContractRef = useRef(null);
    const sendTokensRef = useRef(null);

    useEffect(() => {
        var networkId = props.history.location.state.networkId;
        var network = NetworksApi.getNetwork(networkId);
        setNetwork(network);

    }, [props.history.location.state.networkId]);

    useEffect(() => {
        setNeedDeploy(props.history.location?.state?.codeHash ? false: true);
    }, [props.history.location.state.codeHash]);

    const handleAskPasswordNext = async () => {
        const isValid = await askPasswordRef.current.validate();
        if (!isValid)
            return;

        setActiveStep(prevActiveStep => {
            return prevActiveStep + 1
        });
    };


    const handleDeployWalletNext = async () => {
        if (!network
            || !props.history.location.state.walletId) {
            return;
        }

        const isValid = deployContractRef.current.validate();
        if (!isValid)
            return;
        
        setIsWalletDeploying(true);
        await WalletApi.deployContract(network, props.history.location.state.walletId, password);

        setIsWalletDeploying(false);

        setActiveStep(2);
    };

    const handleSendTokens = async () => {
        const isValid = await sendTokensRef.current.validate();
        if (!isValid)
            return;

        setIsTokensSending(true);
        await WalletApi.sendTokens(network, props.history.location.state.walletId, password, destinationAddress, sendingAmmount, comment);
        setIsTokensSending(false);
        
        Navigation.goToWalletList(props.history);
    };

    const steeps = [
        <AskMasterPasswordStep ref={askPasswordRef}
                                password={password}
                                onConfirm={setPassword} />,
        <DeployContractStep ref={deployContractRef}
                                network={network} 
                                password={password} 
                                walletId={props.history.location.state.walletId}/>,
        <SendTokensStep ref={sendTokensRef}
                        network={network} 
                        password={password}
                        walletId={props.history.location.state.walletId}
                        onAmmountChange={setSendingAmmount}
                        onAddressChange={setDestinationAddress}
                        onCommentChange={setComment} />
    ];

    const stepContent = (step) => {
        if (step === 0)
            return steeps[0];
        if (step === 1 && needDeploy)
            return steeps[1];
        if (step === 1 || step === 2)
            return steeps[2];
    }


    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === 0 || prevActiveStep === 1 || prevActiveStep === 2) {
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

        if (activeStep === 1 && needDeploy)
            return (<Button onClick={handleDeployWalletNext} color="primary" disabled={isWalletDeploying}>
                {isWalletDeploying
                    ? <CircularProgress size={16} className={classes.marginRight} />
                    : <CloudUploadIcon fontSize='small' className={classes.marginRight} />} Deploy
            </Button>);

         if (activeStep === 1 || activeStep === 2)
            return (<Button onClick={handleSendTokens} color="primary" disabled={isTokensSending}>
             {isTokensSending
                 ? <CircularProgress size={16} className={classes.marginRight} />
                 : <SendIcon fontSize='small' className={classes.marginRight} />} Send
         </Button>);
    };

    const renderBackButton = (activeStep) => {
        return (<Button onClick={handleBack} disabled={isWalletDeploying}>
            <KeyboardArrowLeft /> Back
        </Button>);
    };
    
    return MultiFormSteper(needDeploy ? 3 : 2, activeStep, stepContent, renderNextButton, renderBackButton);
}

export default withMainLayout(SendTokensWizard);