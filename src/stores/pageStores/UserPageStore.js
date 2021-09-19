import {makeAutoObservable} from "mobx";
import CalendarStore from "../modelStores/CalendarStore";
import Fetch from "../../js/Fetch";
import {parseUser} from "../../js/functions/functions";

class UserPageStore {
  id = null
  username = null
  is_self = false

  profile = null
  projects = []
  calendar = new CalendarStore()

  range = {}
  daysOffEdit = false
  filterPicked = []
  picked = []
  tab = 'profile'
  unconfirmedProjects = 0
  noOffset = true


  constructor(username) {
    if (username) {
      this.username = username
      Fetch.get(`@${username}`).then(this.setValue)
    }
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'calendar') this[key].setValue(value)
      else this[key] = value
    }
  }

  setTab = (name) => {
    const obj = {
      tab: 'projects',
      daysOffEdit: false,
      picked: [],
    }
    if (name === 'daysOff') this.setValue({...obj, daysOffEdit: !this.daysOffEdit})
    else if (name === 'profile') this.setValue({...obj, tab: 'profile'})
    else if (name === 'projects') this.setValue(obj)
  }

  updateCalendar = () => this.lastCalendarUpdate = new Date().getTime()

  get = () => {
    const username = parseUser()
    if (this.username !== username) {
      this.id = null
      this.username = username
      Fetch.get(`@${username}`).then(this.setValue)
    }
    return this
  }

  update = () => {
    Fetch.get(`@${this.id}`, this.range).then(this.setValue)
  }

}

export default UserPageStore
