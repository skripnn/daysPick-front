import {makeAutoObservable} from "mobx";

class ProjectStore {
  id = null
  dates = []
  user = localStorage.User
  date_start = null
  date_end = null
  days = {}
  title = ''
  money = null
  money_per_day = null
  money_calculating = false
  client = null
  is_paid = false
  info = ''

  constructor() {
    makeAutoObservable(this)
  }

  default = (obj) => {
    this.id = null
    this.dates = []
    this.user = localStorage.User
    this.date_start = null
    this.date_end = null
    this.days = {}
    this.title = ''
    this.money = null
    this.money_per_day = null
    this.money_calculating = false
    this.client = null
    this.is_paid = false
    this.info = ''
    this.setValue(obj)
  }

  setDays = (daysPick, date) => {
    const d = date.format()
    this.setValue({dates: daysPick})
    if (!this['days'].hasOwnProperty(d)) this['days'][d] = null
  }

  setInfo = (value, date) => {
    if (!date) this.info = value
    else {
      const days = {...this.days}
      days[date] = value
      this.setValue({days: days})
    }
  }

  setMoney = () => {
    const valid = (x) => {
      x = Math.floor(x)
      if (Number.isInteger(x)) return x
      return ''
    }
    if (this.money_calculating) this.money = valid(this.money_per_day * this.dates.length)
    else this.money_per_day = valid(this.money / this.dates.length)
  }

  setProject = (project) => {
    this.setValue({...project, hidden: false, dates: [...Object.keys(project.days)]})
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
    if (['dates', 'money', 'money_per_day'].some(r => Object.keys(obj).includes(r))) this.setMoney()
  }

  serializer = () => {
    const project = {
      ...this,
      dates: undefined,
      hidden: undefined,
      days: {}
    }
    for (const date of this.dates) {
      project.days[date] = this.days[date]
    }
    return project
  }

}

export default ProjectStore