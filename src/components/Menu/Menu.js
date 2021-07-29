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
import UserAvatar from "../UserAvatar/UserAvatar";
import UserFullName from "../UserFullName/UserFullName";
import {inject, observer} from "mobx-react";
import {Group, List as ListIcon, PermIdentity, Search, SettingsOutlined} from "@material-ui/icons";
import LogoutIcon from "../Icons/LogoutIcon";
import Fetch from "../../js/Fetch";
import {useSwipeable} from "react-swipeable";
import IconBadge from "../IconBadge/IconBadge";


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
      <ListItem button onClick={props.onClick || handleClick} className={props.className || 'menu-item'} selected={!props.noSelect && !!window.location.pathname.match(props.link)} >
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
          <IconBadge dot content={props.unconfirmedProjects}>
            <UserAvatar {...props.user} />
          </IconBadge>
        </IconButton>
      <Drawer
        open={open}
        onClose={() => close()}
        anchor={'right'}
        className={'menu'}
        {...handlers}
      >
        <MenuItem text={<UserFullName user={props.user} avatar={'right'} badge={props.unconfirmedProjects}/>} link={`@${props.user.username}`} set={props.setUser} noSelect className={'menu-item-top'}/>
        <Divider />
        <List>
          <MenuItem text={'Мои проекты'} icon={<IconBadge content={props.unconfirmedProjects} circle><ListIcon/></IconBadge>} link={`projects`} set={props.setProjects} />
          <MenuItem text={'Мои офферы'} icon={<ListIcon/>} link={`offers`} set={props.setOffers} />
          <MenuItem text={'Мои клиенты'} icon={<Group />} link={`clients`} set={props.setClients} />
        </List>
        <Divider />
        <List>
          <MenuItem text={'Поиск'} icon={<Search />} link={`search`} />
          <MenuItem text={'Профиль'} icon={<PermIdentity />} link={`profile`} />
          <MenuItem text={'Настройки'} icon={<SettingsOutlined />} link={`settings`} />
          <MenuItem text={'Выйти'} icon={<LogoutIcon />} noSelect onClick={() => {
            localStorage.clear()
            window.location.href = '/search/'
          }}/>
        </List>
      </Drawer>
    </div>
  )
}

export default inject(stores => {
  return {
    user: stores.UsersStore.getLocalUser().user,
    unconfirmedProjects: stores.UsersStore.getLocalUser().userPage.unconfirmedProjects,
    getUser: stores.UsersStore.getLocalUser().getUser,
    setUser: stores.UsersStore.setUser,
    setClients: stores.ClientsPageStore.c.set,
    setProjects: stores.ProjectsPageStore.p.set,
    setOffers: stores.OffersPageStore.p.set
  }
})(observer(Menu))
