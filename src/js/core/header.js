import React, {useState} from 'react';
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
  const classes = useStyles();
  if (window.location.pathname.match(/\/login\/?/) || window.location.pathname.match(/\/signup\/?/)) {
    localStorage.clear()
    return <></>
  }
  const user = localStorage.getItem('User')
  if (user) return <UserButton user={user}/>
  return <Link to="/login/" className={classes.titleText}><Button color="inherit">Login</Button></Link>
}

export default function Header() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
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

function UserButton(props) {
  const [text, setText] = useState(props.user)

  function logout() {
    localStorage.clear()
    window.location.href = '/login/'
  }

  function onHover() {
    setText("Log Out")
  }

  function offHover() {
    setText(props.user)
  }

  return (
    <Button color="inherit" onClick={logout} onMouseOver={onHover} onMouseLeave={offHover}>{text}</Button>
  )

}