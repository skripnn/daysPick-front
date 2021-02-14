import {makeAutoObservable} from "mobx";
import UserStore from "./UserStore";
import {parseUser} from "../../js/functions/functions";


class UsersStore {
  users = {}

  constructor() {
    makeAutoObservable(this)
  }

  getUser = (user) => {
    if (!user) user = parseUser()
    if (!user) document.location.href = '/'
    if (!this.users[user]) this.users[user] = new UserStore(user)
    return this.users[user]
  }

  getLocalUser = () => this.getUser(localStorage.User)

}


export default UsersStore
