import {makeAutoObservable} from "mobx";

class AccountStore {
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

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

}

export default AccountStore
