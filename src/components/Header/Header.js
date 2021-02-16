import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "./Header.css"
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Menu from "../Menu/Menu";
import LoginIcon from "../Icons/LoginIcon";
import {IconButton, Tooltip} from "@material-ui/core";


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

  return (
    <AppBar position="static">
      <Toolbar className={'header'} variant={"dense"}>
        <Box flexGrow={1}>
          <Typography variant="h6">
            <Link to="/">{title()}</Link>
          </Typography>
        </Box>
        {auth? (
            <Menu history={props.history}/>
        ) : <Link to={'/login/'}>
          <Tooltip title="Log In">
            <IconButton>
              <LoginIcon/>
            </IconButton>
          </Tooltip>
        </Link>}
      </Toolbar>
    </AppBar>
  );
}

