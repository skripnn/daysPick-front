import {createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#5b5b5b'
    },
    primary: {
      main: '#cae3fc',
      contrastText: '#5b5b5b'
    },
    secondary: {
      main: '#5b5b5b'
    },
    info: {
      main: '#ebedf0'
    },
    success: {
      main: '#4db34b'
    },
    warning: {
      main: '#ff6c6c'
    }
  },
  overrides: {
    MuiButton: {
      textPrimary: {
        color: '#5b5b5b',
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: '#5b5b5b',
        },
      },
      focused: {},
    },
    MuiInput: {
      root: {
        '&$focused': {
          color: '#5b5b5b',
        },
      },
      underline: {
        "&:after": {
          "borderBottom": "2px solid #5b5b5b"
        }
      }
    }
  }
});

export default theme