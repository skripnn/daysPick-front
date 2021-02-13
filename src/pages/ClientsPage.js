import React, {useEffect} from "react";
import {deleteClient, getClients} from "../js/fetch/client";
import ClientDialog from "../components/ClientDialog/ClientDialog";
import {inject, observer} from "mobx-react";
import ClientsList from "../components/ClientsList/ClientsList";


function ClientsPage(props) {
  const {clients, dialog, setClients, delClient, setDialog} = props.ClientsPageStore

  useEffect(() => {
    getClients().then(r => setClients(r))
  },[])

  function del(id) {
    deleteClient(id).then(() => delClient(id))
  }

  return (
    <div>
      <ClientsList
        clients={clients}
        onDelete={del}
        onClick={setDialog}
      />
      {!!dialog && <ClientDialog />}
    </div>
  )
}

export default inject('ClientsPageStore')(observer(ClientsPage))