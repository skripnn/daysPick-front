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
import {ProfileAvatar} from "../UserAvatar/UserAvatar";
import {ProfileFullName} from "../UserFullName/UserFullName";
import {inject, observer} from "mobx-react";
import {Group, List as ListIcon, PermIdentity, Search, SettingsOutlined} from "@material-ui/icons";
import LogoutIcon from "../Icons/LogoutIcon";
import Fetch from "../../js/Fetch";
import {useSwipeable} from "react-swipeable";
import IconBadge from "../IconBadge/IconBadge";
import A from "../core/A";
import mainStore from "../../stores/mainStore";


function Menu({Account:store}) {
  const {unconfirmed_projects, is_confirmed, profile, username, logOut} = store
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  function MenuItem({preLink, link, set, className, noSelect, sub, children, text, icon, badgeProps, onClick}) {
    function handleClose() {
      close()
      if (onClick) onClick()
    }

    const component = (
      <ListItem button onClick={handleClose} className={className || 'menu-item'} selected={!noSelect && !!window.location.pathname.match(link)} >
        {!!icon &&
        <ListItemIcon>
          <IconBadge {...badgeProps}>
            {icon}
          </IconBadge>
        </ListItemIcon>
        }
        <ListItemText primary={children || text} secondary={sub || null}/>
      </ListItem>
    )

    if (!link) return component

    return (
      <A link={link} preLinkFunction={preLink} setter={set} noDiv>
        {component}
      </A>
    )
  }

  const avatar = (
    <IconBadge content={unconfirmed_projects || !is_confirmed} rect={false} dot={!unconfirmed_projects}>
      <ProfileAvatar profile={profile}/>
    </IconBadge>
  )

  const handlers = useSwipeable({
    onSwipedRight: close,
    trackMouse: true
  });

  return (
    <div>
      <IconButton onClick={() => setOpen(true)} style={{marginRight: -12}}>
        {avatar}
      </IconButton>
      <Drawer
        open={open}
        onClose={close}
        anchor={'right'}
        className={'menu'}
        {...handlers}
      >
        <MenuItem
          link={`@${username}`}
          set={mainStore.UserPage.setValue}
          noSelect
          className={'menu-item-top'}
        >
          <ProfileFullName
            profile={profile}
            rightChildren={avatar}
          />
        </MenuItem>
        <Divider />
        <List>
          <MenuItem
            text={'Мои проекты'}
            icon={<ListIcon/>}
            badgeProps={{
              content: unconfirmed_projects,
              rect: false
            }}
            link={`projects`}
            set={mainStore.ProjectsPage.fullList.set}
          />
          <MenuItem
            text={'Мои клиенты'}
            icon={<Group />}
            link={`clients`}
            set={mainStore.ClientsPage.fullList.set}
          />
          <MenuItem
            text={'Исходящие проекты'}
            icon={<ListIcon/>}
            link={`offers`}
            set={mainStore.OffersPage.fullList.set}
          />
        </List>
        <Divider />
        <List>
          <MenuItem text={'Поиск'} icon={<Search />} link={`search`} />
          <MenuItem text={'Профиль'} icon={<PermIdentity />} link={`profile`} />
          <MenuItem
            text={'Настройки'}
            icon={<SettingsOutlined />}
            badgeProps={{
              dot: true,
              content: !is_confirmed,
              rect: false
            }}
            link={`settings`}
          />
          <MenuItem
            text={'Выйти'}
            icon={<LogoutIcon />}
            noSelect
            onClick={() => {
              logOut()
              Fetch.link('search')
            }}
          />
        </List>
      </Drawer>
    </div>
  )
}

export default inject('Account')(observer(Menu))
