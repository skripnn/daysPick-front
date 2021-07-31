import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Menu from "../Menu/Menu";
import LoginIcon from "../Icons/LoginIcon";
import {IconButton, LinearProgress, Tooltip} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import Fetch from "../../js/Fetch";
import {inject, observer} from "mobx-react";


function Header(props) {
  const auth = !!localStorage.User
  const titles = [
    ['/projects', 'Мои проекты'],
    ['/clients', 'Мои клиенты'],
    ['/profile', 'Профиль'],
    ['/settings', 'Настройки'],
    ['/offers', 'Исходящие проекты']
  ]

  const { pathname } = useLocation();
  const [title, setTitle] = useState(getTitle())
  // eslint-disable-next-line
  useEffect(() => setTitle(getTitle()), [pathname])

  function getTitle() {
    let title ='DaysPick'
    for (const [path, name] of titles) {
      if (window.location.pathname.startsWith(path)) {
        title = name
        break
      }
    }
    return title
  }

  const rightButton = !window.location.pathname.startsWith('/login')? (
    <Link to={'/login/'}>
      <Tooltip title="Войти">
        <IconButton>
          <LoginIcon className={'pulse'}/>
        </IconButton>
      </Tooltip>
    </Link>
  ) : null

  return (
    <AppBar position="sticky">
      {props.InfoBarStore.loading && <LinearProgress style={{position: 'absolute', top: 0, width: "100%"}}/>}
      <Toolbar className={'header'} variant={"dense"}>
        <Box flexGrow={1} display={'flex'} alignItems={'center'}>
          <Typography variant="h6" onClick={() => Fetch.autoLink('/')} style={{cursor: 'pointer'}}>{title}</Typography>
          {!window.location.pathname.startsWith('/search')  &&
          <IconButton onClick={() => Fetch.link('search')}>
            <Search/>
          </IconButton>}
        </Box>
        {auth?  <Menu /> : rightButton}
      </Toolbar>
    </AppBar>
  );
}

export default inject('InfoBarStore')(observer(Header))

