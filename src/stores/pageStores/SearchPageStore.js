import {makeAutoObservable} from "mobx";
import ListStore from "../modelStores/ListStore";

class SearchPageStore {

  f = new ListStore()

  constructor() {
    makeAutoObservable(this)
  }

}

export default SearchPageStore