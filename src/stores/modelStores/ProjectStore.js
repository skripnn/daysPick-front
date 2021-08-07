import {action, makeAutoObservable} from "mobx";
import Info from "../../js/Info";

class ProjectStore {
  id = null
  dates = []
  user = localStorage.User
  creator = localStorage.User
  children = []
  date_start = null
  date_end = null
  days = {}
  title = ''
  money = null
  money_per_day = null
  money_calculating = false
  client = null
  is_paid = false
  is_wait = false
  info = ''
  is_folder = false
  parent = null
  confirmed
  canceled

  constructor() {
    makeAutoObservable(this)
  }

  default = action((obj) => {
    this.id = null
    this.dates = []
    this.user = localStorage.User
    this.creator = localStorage.User
    this.children = []
    this.date_start = null
    this.date_end = null
    this.days = {}
    this.title = ''
    this.money = null
    this.money_per_day = null
    this.money_calculating = false
    this.client = null
    this.is_paid = false
    this.is_wait = false
    this.info = ''
    this.is_folder = false
    this.parent = null
    this.confirmed = undefined
    this.canceled = undefined
    this.setValue(obj, false)
  })

  setDays = (daysPick) => {
    this.setValue({dates: daysPick})
    for (const d of daysPick) {
      if (!this['days'].hasOwnProperty(d)) this['days'][d] = null
    }
  }

  setInfo = (value, date) => {
    if (!date) this.setValue({info: value})
    else {
      const days = {...this.days}
      days[date] = value
      this.setValue({days: days})
    }
  }

  setMoney = () => {
    const valid = (x) => {
      if (Number.isFinite(x)) return x || null
      return null
    }
    if (this.money_calculating) this.money = valid(this.money_per_day * this.dates.length)
    else this.money_per_day = valid(this.money / this.dates.length)
  }

  setProject = (project) => {
    this.setValue({...project, hidden: false, dates: [...Object.keys(project.days)]}, false)
  }

  setValue = (obj={}, errors=true) => {
    for (const [key, value] of Object.entries(obj)) {
      console.log(key, value)
      if (errors && this.canceled) {
        Info.info('Изменение недоступно')
        return
      }
      if (errors && this.creator !== this.user) {
        if (['is_paid', 'confirmed'].includes(key)) localStorage.User === this.user ? this[key] = value : Info.info('Изменение недоступно')
        else localStorage.User === this.user ? Info.info('Изменение недоступно') : this[key] = value
      }
      else this[key] = value
      if (key === 'is_paid' && value === true && this.creator === this.user) this.is_wait = false
      if (key === 'user' && value !== localStorage.User) {
        this.is_paid = false
        this.client = null
      }
      if (key === 'parent' && !!value) {
        if (value.client && this.client === null) this.client = value.client
        if (this.money === null && this.money_per_day === null) {
          this.setValue({
            money: value.money,
            money_per_day: value.money_per_day,
            money_calculating: value.money_calculating
          })
        }
      }
    }
    if (['dates', 'money', 'money_per_day'].some(r => Object.keys(obj).includes(r))) this.setMoney()
    if (!!this.children.length) {
      this.is_folder = true
      const dates = []
      this.children.forEach(p => Object.keys(p.days).forEach(d => dates.push(d)))
      this.dates = [...new Set(dates)]
      this.money_calculating ? this.money = null : this.money_per_day = null
    }
    else this.is_folder = false
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
