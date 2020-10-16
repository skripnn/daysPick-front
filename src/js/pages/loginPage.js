import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Link} from "react-router-dom";
import {postLogIn} from "../functions/fetch";

const useStyles = makeStyles((theme) => ({
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

export default function LoginPage() {
  const classes = useStyles();
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(false)
  const [password, setPassword] = useState(false)

  function submit(e) {
    e.preventDefault()
    const data = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    }
    postLogIn(data).then(
      (result) => {
        if (result.token) {
          if (error) setError(null)
          console.log("result", result)
          localStorage.setItem("Authorization", "Token " + result.token)
          localStorage.setItem("User", result.user)
          window.location.href = "/user/" + result.user + "/"
        }
        else setError(<Typography className={classes.error}>Wrong username or password</Typography> )
      }
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form className={classes.form} noValidate>
          <LoginTextField type="username" setField={setUsername}/>
          <LoginTextField type="password" setField={setPassword}/>
          {/*<FormControlLabel*/}
          {/*  control={<Checkbox value="remember" color="primary" size="small"/>}*/}
          {/*  label="Remember me"*/}
          {/*/>*/}
          {error}
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            className={classes.submit}
            onClick={submit}
            disabled={!(username && password)}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              {/*<Link to={}>*/}
              {/*  Forgot password?*/}
              {/*</Link>*/}
            </Grid>
            <Grid item>
              <Link to='/signup/' className={classes.underLink}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

function LoginTextField(props) {
  const label = props.type.charAt(0).toUpperCase() + props.type.slice(1)
  const [helperText, setHelperText] = useState(" ")

  function onChange(e) {
    if (e.target.value.length === 0) {
      setHelperText(label + " can not be empty")
      props.setField(false)
    }
    else {
      setHelperText(" ")
      props.setField(true)
    }
  }

  function onBlur(e) {
    if (e.target.value.length === 0) setHelperText(label + " can not be empty")
  }

  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      name={props.type}
      label={label}
      type={props.type}
      id={props.type}
      autoComplete="current-password"
      autoFocus={props.type === "username"}
      error={helperText !== " "}
      helperText={helperText}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}