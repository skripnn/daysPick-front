import React from "react";
import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";


function ClientItem(props) {
  const client = props.client
  return (
    <ListItem button onClick={() => props.onClick(client)}>
      <ListItemIcon>
        <Avatar>{client.name[0].toUpperCase()}</Avatar>
      </ListItemIcon>
      <ListItemText primary={client.name}/>
      {!!props.onDelete &&
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => props.onDelete(client)}>
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

export default ClientItem