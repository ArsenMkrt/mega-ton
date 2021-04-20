import React, { useEffect, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import NetworksApi from '../../api/NetworkApi';
import WalletApi from '../../api/WalletApi';

const styles = {
    popper: {
        zIndex: 1500
    },
    networkLogo: {
        width: 16,
        paddingRight: 8
    }
}

const SelectNetworkDropDown = (props) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState();
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        var networks = NetworksApi.getNetworks();
        setNetworks(networks);
    }, []);

    useEffect(() => {
        async function loadInitialNetwork() {
            const networkId = await WalletApi.getSelectedNetworkId();
            if (!networkId) {
                setSelectedIndex(0);
                return;
            }

            var networkIndex = networks.map(nt => nt.id).indexOf(networkId);
            setSelectedIndex(networkIndex);
        }

        loadInitialNetwork();
    }, [networks]);

    useEffect(() => {
        if (!networks || selectedIndex === undefined)
            return;

        const network = networks[selectedIndex];
        if (props.onNetworkChanged) {
            props.onNetworkChanged(network);
        }

    }, [networks, selectedIndex, props])

    const handleClick = () => {
        handleToggle();
    };

    const handleMenuItemClick = async (event, index) => {
        setSelectedIndex(index);
        setOpen(false);

        var network = networks[index];
        await WalletApi.setSelectedNetworkId(network.id);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <Grid container direction="column" alignItems="flex-end">
            <Grid item xs={12}>
                <ButtonGroup variant="contained"
                    ref={anchorRef}
                    aria-label="split button"
                    size="small">
                    <Button onClick={handleClick}>
                        <img style={styles.networkLogo} src={networks[selectedIndex]?.logo32} alt='' />
                        {networks[selectedIndex]?.name}
                    </Button>
                    <Button
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="select crypto network"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>
                <Popper style={styles.popper} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {networks.map((network, index) => (
                                            <MenuItem
                                                size="small"
                                                key={network.id}
                                                disabled={index === 2}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                <span>
                                                    <img style={styles.networkLogo} src={network.logo32} alt='' />
                                                    {network.name}
                                                </span>

                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
    );
}

export default SelectNetworkDropDown;