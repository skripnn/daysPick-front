import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#cae3fc",
    color: "rgba(0, 0, 0, 0.8)",
  },
  underLink: {
    textDecoration: "none",
    fontSize: 12,
    color: "black"
  },
  error: {
    fontSize: 12,
    color: "red",
    display: "flex",
    justifyContent: "center",
    marginBottom: -18
  }
}));
