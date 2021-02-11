import React, {useEffect} from "react";
import {deleteClient, getClients} from "../js/fetch/client";
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
import ClientsDialog from "../components/Client/ClientsDialog";
import {inject, observer} from "mobx-react";


function ClientsPage(props) {
  const {clients, dialog, setClients, delClient, setDialog} = props.ClientsPageStore

  useEffect(() => {
    getClients().then(r => setClients(r))
  },[])

  function del(id) {
    deleteClient(id).then(() => delClient(id))
  }

  function ClientItem(props) {
    return (
      <ListItem button onClick={() => setDialog(props)}>
        <ListItemIcon>
          <Avatar>{props.name[0].toUpperCase()}</Avatar>
        </ListItemIcon>
        <ListItemText primary={props.name}/>
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => del(props.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  function convert(client) {
    const list = [{company: null, clients: []}]
    client.forEach(c => {
      if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
      list[list.length - 1].clients.push(c)
    })
    return list
  }

  const style = {textAlign: "center", color: "rgba(0, 0, 0, 0.7)"}

  return (
    <div>
      <List dense>
        <ListSubheader disableSticky style={style}>{"Мои Заказчики"}</ListSubheader>
        {convert(clients).map(i => (
          <div key={i.company}>
            <ListSubheader disableSticky>{i.company}</ListSubheader>
            {i.clients.map(client => <ClientItem {...client} key={client.id}/>)}
          </div>
        ))}
      </List>
      {!!dialog && <ClientsDialog />}
    </div>
  )
}

export default inject('ClientsPageStore')(observer(ClientsPage))