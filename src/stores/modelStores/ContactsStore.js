import {makeAutoObservable} from "mobx";

class ContactsStore {
  email = null
  phone = null
  telegram = null

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }
}

export default ContactsStore
