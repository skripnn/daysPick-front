import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    color: "rgba(0, 0, 0, 0.8)",
    backgroundColor: "#cae3fc",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  titleText: {
    textDecoration: "none",
    color: "inherit"
  }
}));

function RightButton() {
  if (window.location.pathname.match(/\/login\/?/) || window.location.pathname.match(/\/signup\/?/)) {
    localStorage.clear()
    return <></>
  }
  if (!localStorage.User) {
    return <LogInButton/>
  }
  return <LogOutButton/>
}

export default function Header() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar style={{minHeight: 49}}>
          {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
          {/*  <MenuIcon />*/}
          {/*</IconButton>*/}
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.titleText}>Days Pick</Link>
          </Typography>
          <RightButton/>
        </Toolbar>
      </AppBar>
    </div>
  );
}

function LogOutButton() {

  function logout() {
    localStorage.clear()
    window.location.href = '/login/'
  }

  return (
    <Button color="inherit" onClick={logout}>Log Out</Button>
  )

}

function SignUpButton() {
  function signUp() {
    window.location.href = '/signup/'
  }

  return (
    <Button color="inherit" onClick={signUp}>Sign Up</Button>
  )

}

function LogInButton() {
  function login() {
    window.location.href = '/login/'
  }

  return (
    <Button color="inherit" onClick={login}>Log In</Button>
  )

}