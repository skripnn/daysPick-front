import React, {useState} from "react";
import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import "./ClientItem.css"


function ClientItem(props) {
  const [deleting, setDeleting] = useState(false)
  const className = 'client-item' + (deleting ? ' deleting' : '')

  const client = props.client
  return (
    <ListItem
      button
      className={className}
      onClick={deleting? undefined : () => props.onClick(client)}
    >
      <ListItemIcon>
        <Avatar>{client.name[0].toUpperCase()}</Avatar>
      </ListItemIcon>
      <ListItemText primary={client.name}/>
      {!!props.onDelete &&
      <ListItemSecondaryAction className={className}>
        <IconButton
          edge="end"
          disabled={deleting}
          onClick={() => {
            setDeleting(true)
            setTimeout(() => props.onDelete(client), 1000)
          }}>
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

export default ClientItem