import {makeAutoObservable} from "mobx";

class AccountStore {
  id = null
  username = null
  email = null
  email_confirm = null
  phone = null
  phone_confirm = null
  is_public = false
  is_confirmed = true
  facebook_account = null
  badge = false
  can_be_raised = false
  profile = {}
  unconfirmed_projects = 0

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

  logOut = () => {
    localStorage.clear()
    this.id = null
    this.username = null
    this.email = null
    this.email_confirm = null
    this.phone = null
    this.phone_confirm = null
    this.is_public = false
    this.is_confirmed = true
    this.facebook_account = null
    this.badge = false
    this.can_be_raised = false
    this.profile = {}
    this.unconfirmed_projects = 0
  }

}

export default AccountStore
