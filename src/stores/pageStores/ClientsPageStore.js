import {makeAutoObservable} from "mobx";
import ListStore from "../modelStores/ListStore";

class ClientsPageStore {
  dialog = null

  c = new ListStore()
  f = new ListStore()

  constructor() {
    makeAutoObservable(this)
  }

  setDialog = (v) => {
    if (!v) v = null
    this.dialog = v
  }

  saveClient = (client) => {
    this.c.setItem(client)
    this.f.setItem(client)
  }

  delClient = (id) => {
    this.c.del(id)
    this.f.del(id)
  }

}

export default ClientsPageStore