import {makeAutoObservable} from "mobx";

class ProjectStore {
  default = {
    id: null,
    dates: [],
    date_start: null,
    date_end: null,
    days: [],
    title: '',
    money: null,
    money_per_day: null,
    money_calculating: false,
    client: null,
    is_paid: false,
    info: '',
    hidden: false
  }


  constructor() {
    this.reset()
    makeAutoObservable(this)
  }


  setDays = (daysPick, date) => {
    const d = date.format()
    this.setValue({dates: daysPick})
    if (!this['days'].hasOwnProperty(d)) this['days'][d] = null
  }

  setMoney = () => {
    if (this['money_calculating']) this['money'] = Math.floor(this['money_per_day'] * this['dates'].length)
    else this['money_per_day'] = Math.floor(this['money'] / this['dates'].length)
  }

  setValue = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
      if (['dates', 'money', 'money_per_day'].includes(key)) {
        this.setMoney()
      }
    }
  }

  reset = () => this.setValue(this.default)

  serializer = () => {
    const project = {}
    for (const key of Object.keys(this)) {
      if (key in ['dates', 'hidden']) continue
      if (key === 'days') {
        project[key] = {}
        for (const date of this['dates']) {
          project[key][date] = this['days'][date]
        }
      }
      else project[key] = this[key]
    }
    return project
  }

}

export default ProjectStore