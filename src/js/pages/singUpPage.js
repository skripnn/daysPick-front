import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Link} from "react-router-dom";
import {getCheckUsername, postSignUp} from "../functions/fetch";
import {useStyles} from "../core/auth";

export default function SignUpPage() {
  const classes = useStyles();
  const [username, setUsername] = useState(false)
  const [password, setPassword] = useState(false)
  const [email, setEmail] = useState(false)
  const [state, setState] = useState('form')

  function submit(e) {
    e.preventDefault()
    const data = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      email: document.getElementById("email").value
    }
    postSignUp(data).then(
      () => setState('ok')
    )
  }

  if (state === 'ok') return (
    <Typography>
      Please confirm your e-mail
    </Typography>
  )

  if (state === 'form') return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} noValidate>
          <UsernameField setUsername={setUsername}/>
          <PasswordField setPassword={setPassword}/>
          <EmailField setEmail={setEmail}/>
          <Button
            fullWidth
            type="submit"
            variant="outlined"
            className={classes.submit}
            onClick={submit}
            disabled={!(username && password && email)}
          >
            Sign Up
          </Button>
          <Grid container direction="row-reverse">
            <Grid item>
              <Link to='/login/' className={classes.underLink}>
                {"Already have an account? Log In"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

function UsernameField(props) {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("4 symbols minimum")

  function checkUsername(e) {
    e.target.value = e.target.value.toLowerCase()
    const value = e.target.value
    if (value.length < 4) {
      setHelperText("4 symbols minimum")
      return
    }
    if (value.match(/[^a-z0-9_]/)) {
      setHelperText("Use only letters, digits and underscore")
      setError(true)
      return
    }
    getCheckUsername(value).then(result => {
      setHelperText(result.error || " ")
      setError(!!result.error)
    })
  }

  function onBlur() {
    setError(helperText !== " ")
  }

  useEffect(()=> {
    props.setUsername(helperText === " ")
  }, [helperText, props])

  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      id="username"
      label="Username"
      name="username"
      autoFocus
      onChange={checkUsername}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
    />
  )
}

function EmailField(props) {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState(" ")

  function onChange(e) {
    e.target.value = e.target.value.toLowerCase()
    if (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(e.target.value)) {
      setHelperText(" ")
      setError(false)
      props.setEmail(true)
    }
    else {
      setHelperText("Invalid e-mail")
      props.setEmail(false)
    }
  }

  function onBlur(e) {
    e.target.value = e.target.value.toLowerCase()
    if (!/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(e.target.value)) {
      setHelperText("Invalid e-mail")
      setError(true)
    }
  }

  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      id="email"
      label="E-mail"
      name="email"
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
    />
  )
}

function PasswordField(props) {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("8 symbols minimum")

  function checkSymbolsCount(e) {
    if (e.target.value.length >= 8) setHelperText(" ")
    else setHelperText("8 symbols minimum")
  }

  function checkError() {
    setError(helperText !== " ")
  }

  useEffect(() => {
    props.setPassword(helperText === " ")
  }, [helperText, props])

  return (
    <TextField
      size="small"
      margin="dense"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      onChange={checkSymbolsCount}
      onBlur={checkError}
      error={error}
      helperText={helperText}
    />
  )
}
