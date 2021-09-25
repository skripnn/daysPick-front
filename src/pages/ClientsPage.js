import React, {useEffect, useState} from "react";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {Avatar, ListItem, ListSubheader} from "@material-ui/core";
import {convertClients} from "../js/functions/functions";
import Fetch from "../js/Fetch";
import LazyList from "../components/LazyList/LazyList";
import {useAccount} from "../stores/storeHooks";
import {inject, observer} from "mobx-react";
import {AddCircleOutline} from "@material-ui/icons";
import ActionButton2 from "../components/Actions/ActionButton/ActionButton2";
import Item from "../components/Items/Item";


function ClientsPage({ClientsPage:store}) {
  const {fullList, filteredList, save, del} = store
  const {list, page, pages, add} = filteredList.exist() ? filteredList : fullList
  const [dialog, setDialog] = useState(null)
  useEffect(() => setDialog(null), [list])
  const {id} = useAccount()

  function onSave(client) {
    dialog.id ? save(client) : Fetch.get('clients').then(fullList.set).then(() => setDialog(null))
  }

  return (
    <div>
      <LazyList
        searchFieldParams={{
          set: filteredList.set,
          calendarGet: Fetch.calendarGetter(id)
        }}
        getLink={'clients'}
        pages={pages}
        page={page}
        set={fullList.set}
        add={add}
        preLoader
      >
        <ListItem className={'item'} style={{width: 'fit-content'}}>
          <ActionButton2
            label={'Новый клиент'}
            icon={<AddCircleOutline/>}
            onClick={() => setDialog({name: '', company: ''})}
          />
        </ListItem>
        {convertClients(list).map(i => (
          <div key={i.company}>
            <ListSubheader disableSticky>{i.company || ' '}</ListSubheader>
            {i.clients.map(client =>
              <Item
                key={client.id.toString()}
                avatar={<Avatar style={{zoom: 0.7}}>{client.name[0].toUpperCase()}</Avatar>}
                primary={client.name}
                onClick={() => setDialog(client)}
              />
            )}
          </div>
        ))}
      </LazyList>
      <ClientDialog openState={dialog} onClose={() => setDialog(null)} onDelete={del} onSave={onSave}/>
    </div>
  )
}

export default inject('ClientsPage')(observer((ClientsPage)))
