import {makeAutoObservable} from "mobx";

class ListStore {
  list = []
  pages = null
  page = null

  constructor() {
    makeAutoObservable(this)
  }

  set = (r) => {
    this.pages = r? r.pages : null
    this.list = r? r.list : []
    this.page = r? 1 : null
  }

  del = (id) => {
    if (!this.exist()) return
    const i = this.list.findIndex((item) => item.id === id)
    if (i !== -1) this.list.splice(i, 1)
    this.list = [...this.list]
  }

  setItem = (value) => {
    if (!this.exist()) return
    this.list = this.list.map(item => item.id === value.id ? value : item)
  }

  getItem = (id) => this.list.find(item => item.id === id)

  add = (r={}) => {
    this.list = [...this.list, ...r.list]
    this.page += 1
  }

  exist = () => !!this.pages

}

export default ListStore