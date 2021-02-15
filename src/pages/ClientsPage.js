import React, {useEffect, useState} from "react";
import {deleteClient, getClients} from "../js/fetch/client";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {inject, observer} from "mobx-react";
import ClientItem from "../components/ClientItem/ClientItem.js";
import {List, ListSubheader} from "@material-ui/core";
import SearchField from "../components/Fields/SearchField/SearchField";

function ClientsPage(props) {
  const {clients, dialog, setClients, delClient, setDialog} = props.ClientsPageStore
  const [filtered, setFiltered] = useState(null)

  useEffect(() => {
    getClients().then(setClients)
  // eslint-disable-next-line
  },[])

  function del(client) {
    deleteClient(client.id).then(() => delClient(client.id))
  }

  function convert(clients=[]) {
    const list = [{company: null, clients: []}]
    clients.forEach(c => {
      if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
      list[list.length - 1].clients.push(c)
    })
    return list
  }


  return (
    <div>
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset"}}>
          <SearchField get={getClients} set={setFiltered}/>
        </ListSubheader>
        {convert(filtered || clients).map(i => (
          <div key={i.company}>
            <ListSubheader disableSticky>{i.company}</ListSubheader>
            {i.clients.map(client => <ClientItem
              client={client}
              key={client.id}
              onClick={setDialog}
              onDelete={del}/>)}
          </div>
        ))}
      </List>
      {!!dialog && <ClientDialog />}
    </div>
  )
}

export default inject('ClientsPageStore')(observer(ClientsPage))