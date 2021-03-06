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
  const className = 'client-item' + (deleting ? ' deleting' : '') + (props.slim? ' slim' : '')

  const client = props.client
  return (
    <ListItem
      button={!props.disabled}
      className={className}
      onClick={(deleting || props.disabled) ? undefined : () => props.onClick(client)}
    >
      <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
        <Avatar style={{zoom: 0.7}}>{client.name[0].toUpperCase()}</Avatar>
      </ListItemIcon>
      <ListItemText primary={props.showCompany ? client.fullname : client.name} style={{whiteSpace: "nowrap", overflow: "hidden"}}/>
      {!!props.onDelete &&
      <ListItemSecondaryAction className={className + ' delete-button'}>
        <IconButton
          edge="end"
          disabled={deleting}
          onClick={() => {
            if (props.noTimeout) props.onDelete(client)
            else {
              // eslint-disable-next-line no-restricted-globals
              if (!confirm('Удалить клиента?')) return
              setDeleting(true)
              setTimeout(() => props.onDelete(client), 1000)
            }
          }}>
          {props.deleteIcon || <DeleteIcon/>}
        </IconButton>
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

export default ClientItem