import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Link} from "react-router-dom";
import {postLogIn} from "../functions/fetch";
import {useStyles} from "../core/auth";

export default function LoginPage() {
  const classes = useStyles();
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(false)
  const [password, setPassword] = useState(false)

  function submit(e) {
    e.preventDefault()
    const data = new FormData(document.querySelector("form"))
    postLogIn(data).then(
      (result) => {
        if (result.token) {
          if (error) setError(null)
          localStorage.setItem("Authorization", "Token " + result.token)
          localStorage.setItem("User", result.user)
          window.location.href = "/user/" + result.user + "/"
        }
        else setError(<Typography className={classes.error}>{result.error}</Typography>)
      }
    )
  }

  useEffect(() => {
    if (localStorage.getItem("Authorization") && localStorage.getItem("User")) {
      window.location.href = "/user/" + localStorage.getItem("User") + "/"
    }
  }, [])

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