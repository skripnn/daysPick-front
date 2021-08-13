import UserPageStore from "../pageStores/UserPageStore";
import {makeAutoObservable} from "mobx";
import CalendarStore from "./CalendarStore";
import ProfileStore from "./ProfileStore";
import Fetch from "../../js/Fetch";
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

    const folders = []
    projects.forEach(p => {
      if (p.parent) {
        const indexFolder = folders.findIndex(i => i.id === p.parent.id)
        if (indexFolder === -1) {
          folders.push({...p.parent, dates: [...p.dates], date_start: p.date_start, date_end: p.date_end, children: [p], confirmed: true})
        }
        else {
          const parent = folders[indexFolder]
          parent.dates = [...parent.dates, ...p.dates]
          parent.children.push(p)
          if (p.date_start < parent.date_start) parent.date_start = p.date_start
          if (p.date_end > parent.date_end) parent.date_end = p.date_end
          folders[indexFolder] = parent
        }
      }
    })
    return sort([...projects.filter(p => !p.parent), ...folders])
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
