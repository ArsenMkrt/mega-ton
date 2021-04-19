import { Box, makeStyles, MobileStepper } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    backButton: {
        margin: theme.spacing(1)
    },
    steepperBox: {
        position: 'absolute',
        width: '100%',
        bottom: 0
    }
}));


const MultiFormSteper = (stepCount, activeStep, currentStepHandler, nextButtonHandler, backButtonHandler) => {
    const classes = useStyles();

    return (<Box>
        <Box>
            {currentStepHandler(activeStep)}
        </Box>
        <Box className={classes.steepperBox}>
            <MobileStepper
                variant="dots"
                steps={stepCount}
                position="static"
                activeStep={activeStep}
                className={classes.steeper}
                nextButton={nextButtonHandler(activeStep)}
                backButton={backButtonHandler(activeStep)}
            />
        </Box>
    </Box>
    );
};

export default MultiFormSteper;