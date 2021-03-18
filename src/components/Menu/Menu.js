import React, {useState} from "react";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import "./Menu.css"
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import UserAvatar from "../UserAvatar/UserAvatar";
import UserFullName from "../UserFullName/UserFullName";
import {inject, observer} from "mobx-react";
import Button from "@material-ui/core/Button";
import {Group, List as ListIcon, PermIdentity, Search, SettingsOutlined} from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import LogoutIcon from "../Icons/LogoutIcon";
import Fetch from "../../js/Fetch";
import {useSwipeable} from "react-swipeable";


function Menu(props) {
  const [open, setOpen] = useState(false)

  function close(link, set) {
    if (link) Fetch.link(link, set)
    setOpen(false)
  }

  function MenuItem(props) {
    function handleClick() {
      if (props.preLink) props.preLink(props.link, props.set)
      close(props.link, props.set)
    }

    return (
      <ListItem button onClick={handleClick} className={'menu-item'} selected={!props.noSelect && !!window.location.pathname.match(props.link)}>
        {!!props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
        <ListItemText primary={props.text} secondary={props.sub || null}/>
      </ListItem>
    )
  }

  const handlers = useSwipeable({
    onSwipedRight: () => close(),
    trackMouse: true
  });

  return (
    <div>
      <IconButton onClick={() => setOpen(prevState => !prevState)} style={{marginRight: -12}}>
        <UserAvatar {...props.user} />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => close()}
        anchor={'right'}
        className={'menu'}
        {...handlers}
      >
        <Box display={'flex'} className={'menu-item-top'}>
          <Button onClick={() => close()}>
            <ChevronRightIcon />
          </Button>
          <MenuItem text={<UserFullName user={props.user} avatar={'right'}/>} link={`user/${props.user.username}`} set={props.setUser} noSelect/>
        </Box>
        <Divider />
        <List>
          <MenuItem text={'Мои проекты'} icon={<ListIcon/>} link={`projects`} set={props.setProjects} />
          <MenuItem text={'Мои клиенты'} icon={<Group />} link={`clients`} set={props.setClients} />
        </List>
        <Divider />
        <List>
          <MenuItem text={'Поиск'} icon={<Search />} link={`search`} />
          <MenuItem text={'Профиль'} icon={<PermIdentity />} link={`profile`} />
          <MenuItem text={'Настройки'} icon={<SettingsOutlined />} link={`settings`} />
          <MenuItem text={'Выйти'} icon={<LogoutIcon />} link={`/`} noSelect preLink={() => {
            localStorage.clear()
            props.getUser()
          }}/>
        </List>
      </Drawer>
    </div>
  )
}

export default inject(stores => {
  return {
    user: stores.UsersStore.getLocalUser().user,
    getUser: stores.UsersStore.getLocalUser().getUser,
    setUser: stores.UsersStore.setUser,
    setClients: stores.ClientsPageStore.c.set,
    setProjects: stores.ProjectsPageStore.p.set
  }
})(observer(Menu))