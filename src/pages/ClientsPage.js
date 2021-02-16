import React, {useEffect, useState} from "react";
import {deleteClient, getClients, postClient} from "../js/fetch/client";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {inject, observer} from "mobx-react";
import ClientItem from "../components/ClientItem/ClientItem.js";
import {List, ListSubheader} from "@material-ui/core";
import SearchField from "../components/Fields/SearchField/SearchField";
import {convertClients} from "../js/functions/functions";

function ClientsPage(props) {
  const {clients, dialog, setClients, delClient, setDialog, saveClient} = props.ClientsPageStore
  const [filtered, setFiltered] = useState(null)

  useEffect(() => {
    getClients().then(setClients)
  // eslint-disable-next-line
  },[])

  function del(client) {
    deleteClient(client.id).then(() => {
      delClient(client.id)
      setDialog(null)
    })
  }

  function save(client) {
    postClient(client).then((result) => {
      saveClient(result)
      getClients().then(result => setClients(result))
      setDialog(null)
    })
  }


  return (
    <div>
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset"}}>
          <SearchField get={(v) => getClients({filter: v})} set={setFiltered}/>
        </ListSubheader>
        {convertClients(filtered || clients).map(i => (
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
      {!!dialog && <ClientDialog onDelete={del} onSave={save} close={() => setDialog(null)}/>}
    </div>
  )
}


export default inject('ClientsPageStore')(observer(ClientsPage))