import {makeAutoObservable} from "mobx";

class UserPageStore {
  edit = false
  profile = false
  loading = true
  showArchive = false
  dayInfo = null
  dayOffOver = false
  daysPick = new Set()
  isSelf = false
  error = false
  unconfirmedProjects = 0
  lastCalendarUpdate = new Date().getTime()
  activeProfileTab = 'Tags'

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

  updateCalendar = () => this.lastCalendarUpdate = new Date().getTime()

}

export default UserPageStore
