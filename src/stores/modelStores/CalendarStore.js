import {makeAutoObservable} from "mobx";

class CalendarStore {
  days = {}
  daysOff = new Set()
  daysPick = new Set()

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

  setContent = (func) => {
    this.setValue(func(this))
  }
}

export default CalendarStore