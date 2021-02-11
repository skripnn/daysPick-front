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
import {Group, List as ListIcon} from "@material-ui/icons";

function MenuItem(props) {
  return (
    <ListItem button onClick={props.onClick}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} secondary={props.sub || null}/>
    </ListItem>
  )
}



function Menu(props) {
  const [open, setOpen] = useState(false)

  function close(link) {
    if (link) props.history.push(link)
    setOpen(false)
  }

  return (
    <div>
      <IconButton onClick={() => setOpen(prevState => !prevState)} style={{marginRight: -12}}>
        <UserAvatar user={props.user} />
      </IconButton>
      <Drawer
        {...props}
        open={open}
        onClose={close}
        anchor={'right'}
        className={'menu'}
      >
        <List dense style={{display: 'flex'}}>
          <Button onClick={close}>
            <ChevronRightIcon />
          </Button>
          <ListItem button onClick={() => close(`/user/${props.user.username}/`)}>
              <UserFullName user={props.user} avatar={'right'}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <MenuItem text={'Мои проекты'} onClick={() => close(`/projects/`)} icon={<ListIcon/>}/>
          <MenuItem text={'Мои клиенты'} onClick={() => close(`/clients/`)} icon={<Group />}/>
        </List>
      </Drawer>
    </div>
  )
}

export default inject(stores => {
  return {
    user: stores.UsersStore.getUser(localStorage.User).user
  }
})(observer(Menu))