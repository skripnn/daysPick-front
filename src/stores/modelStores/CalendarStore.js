import {makeAutoObservable} from "mobx";

class CalendarStore {
  days = {}
  daysOff = new Set()
  daysPick = new Set()

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (let [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) value = new Set(value)
      this[key] = value
    }
  }

  setContent = (func) => {
    this.setValue(func(this))
  }
}

export default CalendarStore
