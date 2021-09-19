import {makeAutoObservable} from "mobx";

class CalendarStore {
  days = {}
  daysOff = []
  daysPick = []

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (let [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

  setContent = (func) => {
    this.setValue(func(this))
  }
}

export default CalendarStore
