import {makeAutoObservable} from "mobx";

class ProfileStore {
  username = null
  full_name = null
  first_name = null
  last_name = null
  email = null
  email_confirm = null
  phone = null
  phone_confirm = null
  positions = []
  tags = []
  is_public = false
  show_email = true
  show_phone = true
  avatar = null
  photo = null
  facebook_account = null

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