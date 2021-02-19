import {makeAutoObservable} from "mobx";
import UserStore from "./UserStore";
import {parseUser} from "../../js/functions/functions";


class UsersStore {
  users = {}
  phones = {}

  constructor() {
    makeAutoObservable(this)
  }

  getUser = (user) => {
    if (!user) user = parseUser()
    if (!user) document.location.href = '/'
    if (user.match(/[0-9]{11}/)) {
      if (!this.phones[user]) {
        this.phones[user] = new UserStore(user).getUser()
      }
      else if (this.phones[user].user.username) {
        const username = this.phones[user].user.username
        this.users[username] = this.phones[user]
      }
      return this.phones[user]
    }
    if (!this.users[user]) {
      this.users[user] = new UserStore(user).getUser()
    }
    else if (this.users[user].user.phone_confirm) {
      const phone = this.users[user].user.phone_confirm
      this.phones[phone] = this.users[user]
    }
    return this.users[user]
  }

  getLocalUser = () => this.getUser(localStorage.User)

}


export default UsersStore
