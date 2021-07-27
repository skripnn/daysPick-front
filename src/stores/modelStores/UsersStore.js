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
    if (!this.users[user]) {
      this.users[user] = new UserStore(user).getUser(true)
    }
    if (!!this.users[user].error) {
      delete this.users[user]
      return null
    }
    return this.users[user]
  }

  setUser = (r) => {
    const username = r.user.username
    if (!this.users[username]) this.users[username] = new UserStore(username)
    this.users[username].load(r)
  }

  getLocalUser = () => this.getUser(localStorage.User)

  setLocalUser = (r) => {
    const username = r.user.username
    localStorage.setItem("Authorization", `Token ${r.token}`)
    localStorage.setItem("User", username)
    delete r.token
    this.users[username] = new UserStore(username).load(r)
  }

  changeLocalUsername = (r) => {
    const oldUsername = localStorage.User
    localStorage.User = r.username
    this.users[r.username] = this.users[oldUsername]
    this.users[r.username].setValue({user: r})
    delete this.users[oldUsername]
  }

}


export default UsersStore
