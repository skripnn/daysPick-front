import React from "react";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {inject, observer} from "mobx-react";
import ClientItem from "../components/ClientItem/ClientItem.js";
import {ListSubheader} from "@material-ui/core";
import {convertClients} from "../js/functions/functions";
import Fetch from "../js/Fetch";
import LazyList from "../components/LazyList/LazyList";


function ClientsPage(props) {
  const {dialog, delClient, setDialog, saveClient} = props.ClientsPageStore
  const {c, f} = props

  function del(client) {
    Fetch.delete(['client', client.id]).then(() => {
      delClient(client.id)
      setDialog(null)
    })
  }

  function save(client) {
    Fetch.post(['client', client.id], client).then(result => {
      saveClient(result)
      Fetch.get('clients').then(result => {
        f.set(null)
        c.set(result)
      })
      setDialog(null)
    })
  }


  return (
    <div>
      <LazyList
        searchFieldParams={{
          set: f.set,
          calendar: props.calendar,
          user: localStorage.User
        }}
        getLink={'clients'}
        pages={f.pages || c.pages}
        page={f.page || c.page}
        set={c.set}
        add={f.pages ? f.add : c.add}
      >
        <>
          <div style={{height: 12}}/>
          {convertClients(f.exist() ? f.list : c.list).map(i => (
            <div key={i.company}>
              <ListSubheader disableSticky>{i.company || ' '}</ListSubheader>
              {i.clients.map(client => <ClientItem
                client={client}
                key={client.id}
                onClick={setDialog}
                onDelete={del}/>)}
            </div>
          ))}
        </>
      </LazyList>
      {!!dialog && <ClientDialog autoFocus={!dialog.id} onDelete={del} onSave={save} close={() => setDialog(null)}/>}
    </div>
  )
}


export default inject(stores => ({
  c: stores.ClientsPageStore.c,
  f: stores.ClientsPageStore.f,
  ClientsPageStore: stores.ClientsPageStore,
  calendar: stores.UsersStore.getLocalUser().calendar
}))(observer(ClientsPage))