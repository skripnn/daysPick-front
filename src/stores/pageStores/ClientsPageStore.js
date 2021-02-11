import {makeAutoObservable} from "mobx";

class ClientsPageStore {
  clients = []
  dialog = null

  constructor() {
    makeAutoObservable(this)
  }

  setDialog = (v) => {
    if (!v) v = null
    this.dialog = v
  }

  saveClient = (changedClient) => {
    this.clients = this.clients.map(client => client.id === changedClient.id ? changedClient : client)
  }

  setClients = (clients) => {
    this.clients = clients
  }

  delClient = (id) => {
    this.clients = this.clients.filter(client => client.id !== id)
  }

}

export default ClientsPageStore