import React from "react";
import {Dialog, DialogContent, DialogTitle, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import LazyList from "../LazyList/LazyList";
import UserAvatar from "../UserAvatar/UserAvatar";
import TextLoop from "react-text-loop";
import {inject, observer} from "mobx-react";
import CloseButton from "../CloseButton/CloseButton";
import {useMobile} from "../hooks";

function UserChoiceDialog({open, close, f, onClick}) {
  const {list, set, add} = f

  const fullScreen = useMobile()

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={close}
      open={open}
    >
      <DialogTitle>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Typography>Пользователь</Typography>
          <CloseButton onClick={close}/>
        </div>
      </DialogTitle>
      <DialogContent>
        <LazyList
          searchFieldParams={{
            set: set,
            placeholder: "Кого искать?",
            autoFocus: true,
            minFilter: 3,
            noFilter: true,
            helperText: 'Введи имя, телефон или специализацию'
          }}
          add={add}
          getLink={'users'}
        >
          {!!list && list.map(user => (
            <ListItem button key={user.username} onClick={() => {
              onClick(user)
              close()
            }} style={{paddingLeft: 0, paddingRight: 0}}>
              <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
                <UserAvatar {...user}/>
              </ListItemIcon>
              <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={
                <TextLoop children={user.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}} className={'text-loop'}/>
              }/>
            </ListItem>
          ))}
        </LazyList>
      </DialogContent>
    </Dialog>
  )
}

export default inject(stores => ({
  f: stores.SearchPageStore.f,
}))(observer(UserChoiceDialog))
