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
    const delFromChildren = (id, item) => {
      const i = item.children.findIndex((item) => item.id === id)
      if (i !== -1) item.children.splice(i, 1)
      return item.children.length === 0 ? item.id : id
    }

    if (!this.exist()) return
    const i = this.list.findIndex((item) => {
      if (item.children) id = delFromChildren(id, item)
      return item.id === id
    })
    if (i !== -1) this.list.splice(i, 1)
    this.list = [...this.list]
  }

  setItem = (value) => {
    const setToChildren = (value, item) => {
      if (item.children.find(item => item.id === value.id)) {
        return {...item, children: item.children.map(item => item.id === value.id ? value : item)}
      }
      return item
    }

    if (!this.exist()) return
    this.list = this.list.map(item => {
      if (item.children) item = setToChildren(value, item)
      return item.id === value.id ? value : item
    })
  }

  getItem = (id) => this.list.find(item => item.id === id)

  add = (r={}) => {
    this.list = [...this.list, ...r.list]
    this.page += 1
  }

  exist = () => !!this.pages

}

export default ListStore
