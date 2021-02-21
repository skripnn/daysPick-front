import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Menu from "../Menu/Menu";
import LoginIcon from "../Icons/LoginIcon";
import {IconButton, Tooltip} from "@material-ui/core";
import {Search} from "@material-ui/icons";


export default function Header(props) {
  const auth = !!localStorage.User
  const titles = [
    ['/projects', 'Мои проекты'],
    ['/clients', 'Мои клиенты'],
    ['/profile', 'Профиль']
  ]
  function title() {
    for (const [path, name] of titles) {
      if (window.location.pathname.startsWith(path)) return name
    }
    return 'DaysPick'
  }

  const rightButton = !window.location.pathname.startsWith('/login')? (
    <Link to={'/login/'}>
      <Tooltip title="Log In">
        <IconButton>
          <LoginIcon/>
        </IconButton>
      </Tooltip>
    </Link>
  ) : null

  return (
    <AppBar position="static">
      <Toolbar className={'header'} variant={"dense"}>
        <Box flexGrow={1} display={'flex'} alignItems={'center'}>
          <Typography variant="h6">
            <Link to="/">{title()}</Link>
          </Typography>
          {!window.location.pathname.startsWith('/search')  &&
          <IconButton onClick={() => props.history.push('/search/')}>
            <Search/>
          </IconButton>}
        </Box>
        {auth?  <Menu history={props.history}/> : rightButton}
      </Toolbar>
    </AppBar>
  );
}

