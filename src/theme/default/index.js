import { createMuiTheme } from '@material-ui/core/styles';

const colors = {
    dark: '#20262A',
    light: '#FDFDFD',
    neutral: '#ABB4B8',
    accent: '#0088CC',
    orange: '#FF5F33',
    green: '#719E64',
    pink: '#FFBBB6',
    blue: '#5186C1',
    yellow: '#EEC100'
};

const theme = createMuiTheme({
    header: {
        background: 'linear-gradient(to right top, #ff5f33, #ff7923, #fd920f, #f7aa00, #eec100)',
        brandColor: colors.dark,
        sloganColor: colors.light
    },
    primary: {
        main: colors.blue
    },
    palette: {
        text: {
            primary: colors.dark
        }
    },
    props: {
        MuiButton: {
            size: 'small',
            variant: 'contained'
        },
        MuiContainer: {
            maxWidth: 'xs',
            disableGutters: true
        },
        MuiTextField: {
            variant: 'outlined',
            size: 'small'
        },
        MuiMenu: {
            size: 'small'
        },
        MuiIconButton: {
            size: 'small'
        }
    },
    typography: {
        fontFamily: '"PT Root UI", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export default theme;