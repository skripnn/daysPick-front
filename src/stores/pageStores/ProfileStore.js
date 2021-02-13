import {makeAutoObservable} from "mobx";

class ProfileStore {
  username = null
  full_name = null
  first_name = null
  last_name = null

  constructor(username) {
    this.username = username
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

}

export default ProfileStore