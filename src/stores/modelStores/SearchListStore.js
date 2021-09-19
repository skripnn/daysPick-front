import {makeAutoObservable} from "mobx";
import ListStore from "../modelStores/ListStore";

class SearchListStore {
  fullList = new ListStore()
  filteredList = new ListStore()

  constructor() {
    makeAutoObservable(this)
  }

  save = (value) => {
    this.fullList.setItem(value)
    this.filteredList.setItem(value)
  }

  del = (value) => {
    this.fullList.del(value.id)
    this.filteredList.del(value.id)
  }
}

export default SearchListStore
