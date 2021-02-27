import {Link} from "react-router-dom";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import UserAvatar from "../UserAvatar/UserAvatar";
import React from "react";
import TextLoop from "react-text-loop";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function UserItem(props) {
  const user = props.user
  const mobile = useMediaQuery('(min-width:600px)')
  const tags = (mobile?
    <>
      {user.tags[0].title}
      {user.tags.length > 1 ? <>, <TextLoop children={user.tags.slice(1).map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}}/></> : ''}
    </> :
      <TextLoop children={user.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}}/>
    )


  return (
    <Link to={`/user/${user.username}/`}>
      <ListItem button>
        <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
          <UserAvatar {...user}/>
        </ListItemIcon>
        <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={user.tags.length ? tags : ' '}/>
      </ListItem>
    </Link>
  )
}