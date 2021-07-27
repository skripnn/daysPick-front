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
    this.user.setValue({username: username})
    if (username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({profile:  true})
    makeAutoObservable(this)
  }

  getUser = () => {
    Fetch.get(`@${this.user.username}`).then(r => {
      if (r.error) {
        this.userPage.setValue({error: r.error})
        // localStorage.clear()
        // mainStore.reset()
        // Fetch.link('login')
      }
      else this.load(r)
    })
    return this
  }

  getActualProjects = () => {
    Fetch.get(`@${this.user.username}`, {projects: 1}).then(r => {
      if (!r.error) this.setProjects(r)
    })
  }

  getProject = (id) => {
    return this.projects.find(project => project.id === id)
  }

  load = (obj) => {
    if (obj.user.username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({isSelf: false, profile: (!obj.projects || !obj.projects.length)})
    if (this.userPage.loading) this.setValue(obj)
    else this.setValue({...obj, calendar: undefined})
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
    const compareDates = (a, b) => {
      if (a.date_start < b.date_start) return -1
      if (a.date_start > b.date_start) return 1
      if (a.date_end < b.date_end) return -1
      if (a.date_end > b.date_end) return 1
      return 0
    }
    projectsNew.sort(compareDates)
    if (this.userPage.isSelf) {
      this.projects = [...projectsNew.filter(p => !p.confirmed), ...projectsNew.filter(p => p.confirmed)]
      this.userPage.setValue({unconfirmedProjects: this.projects.filter(i => !i.confirmed).length})
    }
    else this.projects = projectsNew
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'projects') this.setProjects(value)
      else this[key].setValue(value)
    }
  }

}

export default UserStore
