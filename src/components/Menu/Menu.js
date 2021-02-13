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
import Box from "@material-ui/core/Box";

function MenuItem(props) {
  return (
    <ListItem button onClick={props.onClick} className={'menu-item'}>
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
        <Box display={'flex'} style={{height: 48, padding: "2px 0"}}>
          <Button onClick={close} style={{minWidth: 56, borderRadius: "0 4px 4px 0"}}>
            <ChevronRightIcon />
          </Button>
          <ListItem button onClick={() => close(`/user/${props.user.username}/`)} className={'menu-item'} style={{paddingRight: 0, borderRadius: "4px 0 0 4px"}}>
              <UserFullName user={props.user} avatar={'right'}/>
          </ListItem>
        </Box>
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