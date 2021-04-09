import {makeAutoObservable} from "mobx";
import {Loader} from "../../js/Loader";

class InfoBarStore {
  list = {}
  loader = new Loader()
  confirm = null

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
    this.loader.set(() => delete this.list[time], 1000)
  }

  setConfirm = (obj) => {
    this.confirm = obj
  }

}

export default InfoBarStore