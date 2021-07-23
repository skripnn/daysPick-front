import UserPageStore from "../pageStores/UserPageStore";
import {makeAutoObservable} from "mobx";
import CalendarStore from "./CalendarStore";
import ProfileStore from "./ProfileStore";
import Fetch from "../../js/Fetch";
import {newDate} from "../../js/functions/date";

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
        // localStorage.clear()
        // mainStore.reset()
        // Fetch.link('login')
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
    else this.userPage.setValue({isSelf: false, profile: (!obj.projects || !obj.projects.length)})
    this.userPage.setValue({loading: false})
  }

  delProject = (id) => {
    this.projects = this.projects.filter(project => project.id !== id)
  }

  setProjects = (projects) => {
    const projectsNew = projects.map(project => {
      const isFolder = !!project.children && !!project.children.length
      if (isFolder) {
        project.children = project.children.filter(p => !(p.date_end < newDate().format() && p.is_paid))
        project.days = {}
        project.children.forEach(p => Object.keys(p.days).forEach(d => project.days[d] = null))
        const dates = Object.keys(project.days)
        dates.sort()
        project.date_start = dates[0]
        project.date_end = dates[dates.length - 1]
      }
      return project
    })
    const compare = (a, b) => {
      if (a.date_start < b.date_start) return -1
      if (a.date_start > b.date_start) return 1
      if (a.date_end < b.date_end) return -1
      if (a.date_end > b.date_end) return 1
      return 0
    }
    projectsNew.sort(compare)
    this.projects = projectsNew
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'projects') this.setProjects(value)
      else this[key].setValue(value)
    }
  }

}

export default UserStore
