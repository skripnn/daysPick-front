import UserPageStore from "../pageStores/UserPageStore";
import {makeAutoObservable} from "mobx";
import CalendarStore from "./CalendarStore";
import ProfileStore from "./ProfileStore";
import Fetch from "../../js/Fetch";
import mainStore from "../mainStore";

class UserStore {
  user = new ProfileStore()
  calendar = new CalendarStore()
  projects = []
  userPage = new UserPageStore()
  error

  constructor(username) {
    if (username.match(/[0-9]{11}/)) {
      this.user.setValue({phone_confirm: username})
    }
    else this.user.setValue({username: username})

    if (username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({profile:  true})
    makeAutoObservable(this)
  }

  getUser = () => {
    Fetch.get(['user', (this.user.username || this.user.phone_confirm)]).then(r => {
      if (r.error && this.user.username === localStorage.User) {
        localStorage.clear()
        mainStore.reset()
        Fetch.link('login')
      }
      else this.load(r)
    })
    return this
  }

  getProject = (id) => {
    return this.projects.find(project => project.id === id)
  }

  load = (obj) => {
    this.setValue(obj)
    if (this.user.username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({isSelf: false, profile: true})
    this.userPage.setValue({loading: false})
  }

  delProject = (id) => {
    this.projects = this.projects.filter(project => project.id !== id)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'projects') this[key] = value
      else this[key].setValue(value)
    }
  }

}

export default UserStore