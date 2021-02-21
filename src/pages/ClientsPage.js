import React, {useEffect, useState} from "react";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {inject, observer} from "mobx-react";
import ClientItem from "../components/ClientItem/ClientItem.js";
import {List, ListSubheader} from "@material-ui/core";
import SearchField from "../components/Fields/SearchField/SearchField";
import {convertClients} from "../js/functions/functions";
import Fetch from "../js/Fetch";

function ClientsPage(props) {
  const {clients, dialog, setClients, delClient, setDialog, saveClient} = props.ClientsPageStore
  const [filtered, setFiltered] = useState(null)

  useEffect(() => {
    Fetch.get('clients').then(setClients)
  // eslint-disable-next-line
  },[])

  function del(client) {
    Fetch.delete(['client', client.id]).then(() => {
      delClient(client.id)
      setDialog(null)
    })
  }

  function save(client) {
    Fetch.post(['client', client.id], client).then(result => {
      saveClient(result)
      Fetch.get('clients').then(result => setClients(result))
      setDialog(null)
    })
  }


  return (
    <div>
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}}>
          <SearchField get={v => Fetch.get('clients', v)} set={setFiltered} calendar={props.calendar} user={localStorage.User}/>
        </ListSubheader>
        <div style={{height: 12}}/>
        {convertClients(filtered || clients).map(i => (
          <div key={i.company}>
            <ListSubheader disableSticky>{i.company || ' '}</ListSubheader>
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


export default inject(stores => ({
  ClientsPageStore: stores.ClientsPageStore,
  content: stores.UsersStore.getLocalUser().calendar
}))(observer(ClientsPage))