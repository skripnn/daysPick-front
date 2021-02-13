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

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

}

export default UserPageStore