import { Box, Card, CardActions, createStyles, IconButton, makeStyles, Tooltip, Typography } from "@material-ui/core"
import SendIcon from '@material-ui/icons/Send';
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import ConverterApi from "../../api/ConverterApi";
import AddressView from "../AddressView";
import WalletMoreVertMenu from "./WalletMoreVertMenu";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(1)
    },
    balanceSkeleton: {
        display: 'inline-block',
        width: 100,
        marginLeft: theme.spacing(1)
    },
    balance: {
        marginLeft: theme.spacing(1)
    },
    balanceReminder: {
        color: theme.palette.text.hint
    },
    addressView: {
        marginTop: theme.spacing(1)
    },
    moreVertButton: {
        float: 'right'
    },
    actionLeftButton: {
        marginLeft: 'auto'
    }
}));

const BalanceAmmount = (props) => {
    const classes = useStyles();

    const [balanceParts, setBalanceParts] = useState({});

    useEffect(() => {
        if (isNaN(props.balance))
            return;
        const parts = ConverterApi.getNanoWholeAndReminder(props.balance);
        setBalanceParts(parts);

    }, [props.balance])

    return (<>
        <span className={classes.balance}>{balanceParts.whole}.<small className={classes.balanceReminder}>{balanceParts.reminder?.substring(0, 3)}</small></span>
    </>);
}

const BalanceView = (props) => {
    const classes = useStyles();

    const onDeleteClicked = () => {
        if (props.onDelete)
            props.onDelete();
    }

    return (<Typography variant="h6" component="h2">
        <Box>
            <img src={props?.network?.logo32} alt='' />
            {isNaN(props.balance)
                ? <Skeleton className={classes.balanceSkeleton} />
                : (<BalanceAmmount balance={props.balance} />)}
            <span className={classes.moreVertButton}>
                <WalletMoreVertMenu onDelete={onDeleteClicked} />
            </span>
        </Box>
    </Typography>);
}

const WalletCard = (props) => {
    const classes = useStyles();

    const handleSend = () => {
        if (props.onSendTokens){
            props.onSendTokens();
        }
    };

    const onDeleteClicked = () => {
        if (props.onDelete)
            props.onDelete();
    };

    const emptyBalance = (balance) => {
        if (!balance)
            return true;
        return balance === '0';
    };

    return (<>
        <Card className={classes.root} fontSize="small">
            <BalanceView network={props.network} balance={props.wallet.balance} onDelete={onDeleteClicked} />
            <Box className={classes.addressView}>
                <AddressView wallet={props.wallet}
                    explorer={props.network?.accountExplorerUrl} />
            </Box>
            <CardActions disableSpacing>
                <Tooltip title="Send Tokens">
                    <span className={classes.actionLeftButton}>
                        <IconButton color="primary"
                            aria-label="Send Tokens"
                            onClick={handleSend}
                            disabled={emptyBalance(props.wallet?.balance)}>
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </CardActions>
        </Card>
    </>)
}

export default WalletCard;