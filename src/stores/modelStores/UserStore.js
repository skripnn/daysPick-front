import UserPageStore from "../pageStores/UserPageStore";
import {makeAutoObservable} from "mobx";
import CalendarStore from "./CalendarStore";
import ProfileStore from "./ProfileStore";
import Fetch from "../../js/Fetch";
import {newDate} from "../../js/functions/date";
import Info from "../../js/Info";

class UserStore {
  user = new ProfileStore()
  calendar = new CalendarStore()
  offersCalendar = new CalendarStore()
  projects = []
  offers = []
  userPage = new UserPageStore()
  error

  constructor(username) {
    this.user.setValue({username: username})
    if (username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({profile:  true})
    makeAutoObservable(this)
  }

  getUser = () => {
    Info.loading(true)
    Fetch.get(`@${this.user.username}`).then(r => {
      if (r.error) {
        this.userPage.setValue({error: r.error})
      }
      else this.load(r)
      Info.loading(false)
    })
    return this
  }

  getActualProjects = () => {
    Fetch.get(`@${this.user.username}`, {projects: 1}).then(r => {
      if (!r.error) this.setProjects(r)
    })
  }

  getActualOffers = () => {
    Fetch.get(`@${this.user.username}`, {offers: 1}).then(r => {
      if (!r.error) this.setOffers(r)
    })
  }

  getProject = (id) => {
    return this.projects.find(project => project.id === id)
  }

  load = (obj) => {
    if (obj.user.username === localStorage.User) this.userPage.setValue({isSelf: true})
    else this.userPage.setValue({isSelf: false, profile: (!obj.projects || !obj.projects.length)})
    if (this.userPage.loading) {
      this.setValue(obj)
      if (!!obj.user.info) this.userPage.setValue({activeProfileTab: 'Info'})
      else if (!!obj.user.tags && !!obj.user.tags.length) this.userPage.setValue({activeProfileTab: 'Tags'})
      else if (Object.values(obj.user.contacts).find(i => i !== null)) this.userPage.setValue({activeProfileTab: 'Contacts'})
    }
    else {
      this.setValue({...obj, calendar: undefined})
      this.userPage.updateCalendar()
    }
    this.userPage.setValue({loading: false})
    return this
  }

  delProject = (id) => {
    this.projects = this.projects.filter(project => project.id !== id)
  }

  projectListTransform = (projects) => {
    const sort = (list) => {
      const compareDates = (a, b) => {
        if (a.date_start < b.date_start) return -1
        if (a.date_start > b.date_start) return 1
        if (a.date_end < b.date_end) return -1
        if (a.date_end > b.date_end) return 1
        return 0
      }
      list.sort(compareDates)
      return [...list.filter(p => !p.confirmed), ...list.filter(p => p.confirmed)]
    }
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
        project.children = sort(project.children)
      }
      return project
    })
    return sort(projectsNew)
  }

  setProjects = (projects) => {
    this.projects = this.projectListTransform(projects)
    this.userPage.setValue({unconfirmedProjects: this.projects.filter(i => !i.confirmed).length})
  }

  setOffers = (offers) => {
    this.offers = this.projectListTransform(offers)
  }

  setValue = (obj={}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'projects') this.setProjects(value)
      else if (key === 'offers') this.setOffers(value)
      else this[key].setValue(value)
    }
  }

}

export default UserStore
