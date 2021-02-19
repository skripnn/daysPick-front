import {Link} from "react-router-dom";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import UserAvatar from "../UserAvatar/UserAvatar";
import React from "react";

export default function UserItem(props) {
  const user = props.user

  return (
    <Link to={`/user/${user.username}/`}>
      <ListItem button>
        <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
          <UserAvatar {...user}/>
        </ListItemIcon>
        <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={user.positions.join(', ') || ' '}/>
      </ListItem>
    </Link>
  )
}