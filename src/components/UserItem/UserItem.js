// import {Link} from "react-router-dom";
import {ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import UserAvatar from "../UserAvatar/UserAvatar";
import React from "react";
import TextLoop from "react-text-loop";
import './UserItem.css'
import {inject, observer} from "mobx-react";
import Fetch from "../../js/Fetch";
import {useMobile} from "../hooks";

function UserItem(props) {
  const user = props.user
  const mobile = useMobile()
  const tags = user.tags.length ? (mobile ?
      <>
        {user.tags[0].title}
        {user.tags.length > 1 ? <>, <TextLoop children={user.tags.slice(1).map(tag => tag.title)}
                                              springConfig={{stiffness: 180, damping: 8}}
                                              className={'text-loop'}/></> : ''}
      </> :
      <TextLoop children={user.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}}
                className={'text-loop'}/>
  ) : ' '
  const className = 'user-item' + (props.slim ? ' slim' : '')

  return (
    // <Link to={`/user/${user.username}/`}>
    <ListItem button className={className}
              onClick={props.onClick ? props.onClick : () => Fetch.link(`user/${user.username}`, props.setUser)}>
      <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
        <UserAvatar {...user}/>
      </ListItemIcon>
      <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={props.noTags ? undefined : tags}/>
      {!!props.secondaryAction &&
      <ListItemSecondaryAction style={{right: 2}}>{props.secondaryAction}</ListItemSecondaryAction>}
    </ListItem>
    // </Link>
  )
}

export default inject(stores => ({
  setUser: stores.UsersStore.setUser
}))(observer(UserItem))
