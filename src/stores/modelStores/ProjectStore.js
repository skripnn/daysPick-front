import {makeAutoObservable} from "mobx";

class ProjectStore {

  id = null

  title = null
  days = {}

  money = null
  money_calculating = false
  money_per_day = null

  client = null

  user = null
  creator = null
  canceled = null

  is_paid = false
  is_wait = false

  info = ''

  parent = null

  confirmed = true

  constructor() {
    makeAutoObservable(this)
  }


  setValue = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
    if (['days', 'money', 'money_per_day'].some(r => Object.keys(obj).includes(r))) this.moneyRecalculate()
  }

  setParent = (obj) => {
    this.parent = obj
    if (obj) {
      if (!this.client) this.client = obj.client
      if (!this.money && !this.money_per_day) {
        this.setValue({money: obj.money, money_calculating: obj.money_calculating, money_per_day: obj.money_per_day})
      }
    }
  }

  moneyRecalculate = () => {
    const valid = (x) => {
      if (Number.isFinite(x)) return x || null
      return null
    }
    const daysCount = Object.keys(this.days).length
    if (this.money_calculating) this.money = valid(this.money_per_day * daysCount)
    else this.money_per_day = valid(this.money / daysCount)
  }

  setInfo = (value, date) => {
    if (!date) this.setValue({info: value})
    else {
      const days = {...this.days}
      days[date] = value
      this.setValue({days: days})
    }
  }

}

export default ProjectStore
