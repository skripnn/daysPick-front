import {makeAutoObservable} from "mobx";
// import ContactsStore from "./ContactsStore";

class ProfileStore {
  username = null
  full_name = null
  first_name = null
  last_name = null
  email = null
  // email_confirm = null
  phone = null
  telegram = null
  // phone_confirm = null
  // positions = []
  tags = []
  // is_public = false
  is_confirmed = true
  avatar = null
  photo = null
  // facebook_account = null
  // badge = false
  info = null

  // contacts = new ContactsStore()

  constructor(username) {
    this.username = username
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      // if (key === 'contacts') this.contacts.setValue(value)
      // else this[key] = value
      this[key] = value
    }
  }

}

export default ProfileStore
