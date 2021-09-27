import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Menu from "../Menu/Menu";
import LoginIcon from "../Icons/LoginIcon";
import {IconButton, Tooltip} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import './Header.css'
import {NotConfirmBar} from "./NotConfirmBar";
import A from "../core/A";
import {useUserLink} from "../../stores/storeHooks";
import mainStore from "../../stores/mainStore";


export default function Header() {
  const auth = !!localStorage.Authorization
  const titles = [
    [/^\/projects\/?$/, 'Мои проекты'],
    [/^\/project\/?$/, 'Новый проект'],
    [/^\/clients\/?$/, 'Мои клиенты'],
    [/^\/favorites\/?$/, 'Избранное'],
    [/^\/profile\/?$/, 'Профиль'],
    [/^\/settings\/?$/, 'Настройки'],
    [/^\/offers\/?$/, 'Исходящие проекты']
  ]

  const { pathname } = useLocation();
  const link = useUserLink()
  const [title, setTitle] = useState(getTitle())
  // eslint-disable-next-line
  useEffect(() => setTitle(getTitle()), [pathname])

  function getTitle() {
    let title ='DaysPick'
    for (const [path, name] of titles) {
      if (pathname.match(path)) {
        title = name
        break
      }
    }
    if (!pathname.startsWith('/@')) document.title = 'DaysPick' + (title === 'DaysPick' ? '' : ` / ${title}`)
    return title
  }

  const rightButton = !pathname.startsWith('/login')? (
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
      <Toolbar variant={"dense"} style={{minHeight: 54}}>
        <Box flexGrow={1} display={'flex'} alignItems={'center'}>
          <A link={auth ? link : '/'} setter={auth ? mainStore.UserPage.setValue : undefined}>
            <Typography variant="h6" style={{cursor: 'pointer'}}>{title}</Typography>
          </A>
          {!pathname.startsWith('/search')  &&
            <A link={'search'}>
              <IconButton>
                <Search/>
              </IconButton>
            </A>}
        </Box>
        {auth?  <Menu /> : rightButton}
      </Toolbar>
      {auth && <NotConfirmBar/>}
    </AppBar>
  );
}
