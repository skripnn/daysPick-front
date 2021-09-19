import {makeAutoObservable} from "mobx";
import {Loader} from "../../js/Loader";

class InfoBarStore {
  list = {}
  loader = new Loader()
  confirm = null
  loading = false
  mobile = false

  constructor() {
    makeAutoObservable(this)
  }

  add = (alert={}) => {
    const obj = {}
    const time = new Date().getTime().toString()
    for (const [key, value] of Object.entries(alert)) {
      obj[time] = {severity: key, children: value}
    }
    this.list = {...this.list, ...obj}
  }

  del = (time) => {
    const obj = {}
    obj[time] = {...this.list[time], close: true}
    this.list = {...this.list, ...obj}
    this.loader.set(() => this.deleteTime(time), 1000)
  }

  deleteTime = (time) => {
    const list = {...this.list}
    delete list[time]
    this.list = list
  }

  setConfirm = (obj) => {
    this.confirm = obj
  }

  setLoading = (bool) => {
    this.loading = bool
  }

  setMobile = (bool) => {
    this.mobile = bool
  }

}

export default InfoBarStore
