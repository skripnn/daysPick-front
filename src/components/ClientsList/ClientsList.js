import React from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
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
        <IconButton edge="end" onClick={() => props.onDelete(client.id)}>
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

export default function ClientsList(props) {
  function convert(clients=[]) {
    const list = [{company: null, clients: []}]
    clients.forEach(c => {
      if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
      list[list.length - 1].clients.push(c)
    })
    return list
  }

  const style = {textAlign: "center", color: "rgba(0, 0, 0, 0.7)"}

  return (
    <div>
      <List dense>
        <ListSubheader disableSticky style={style}>{props.title || "Мои Клиенты"}</ListSubheader>
        {convert(props.clients).map(i => (
          <div key={i.company}>
            <ListSubheader disableSticky>{i.company}</ListSubheader>
            {i.clients.map(client => <ClientItem client={client} key={client.id} onClick={props.onClick} onDelete={props.onDelete}/>)}
          </div>
        ))}
      </List>
    </div>
  )
}