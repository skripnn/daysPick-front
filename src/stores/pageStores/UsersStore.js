import {makeAutoObservable} from "mobx";


class UsersStore {
  users = {}

  default = {
    user: {},
    calendar: {
      days: {},
      daysOff: new Set(),
      daysPick: new Set()
    },
    projects: [],
    userPage: {
      edit: false,
      profile: false,
      loading: true,
      showArchive: false,
      dayInfo: null,
      dayOffOver: false
    }
  }

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj, user) => {
    for (const [key, value] of Object.entries(obj)) {
      this.users[user].userPage[key] = value
    }
  }

  setUser = (user) => {
    this.users[user.username].user = user
  }

  setProjects = (projects, user) => {
    this.users[user].projects = projects
  }

  delProject = (id, user) => {
    const i = this.users[user].projects.findIndex((project) => project.id === id)
    if (i !== -1) this.users[user].projects.splice(i, 1)
  }

  setProject = (project, user) => {
    const i = this.users[user].projects.findIndex((p) => p.id === project.id)
    if (i !== -1) this.users[user].projects[i] = {...project}
    else this.users[user].projects.push(project)
  }

  getProject = (id, user) => {
    return this.users[user].projects.find(project => project.id === id)
  }

  setCalendar = (func, user) => {
    this.users[user].calendar = func(this.users[user].calendar)
  }

  getUser = (user) => {
    if (!this.users[user]) this.users[user] = {...this.default}
    return {
      ...this.users[user],
      calendar: {
        content: this.users[user].calendar,
        setContent: (func) => this.setCalendar(func, user)
      },
      setUser: this.setUser,
      setProjects: (projects) => this.setProjects(projects, user),
      setValue: (obj) => this.setValue(obj, user),
      delProject: (id) => this.delProject(id, user),
      setProject: (project) => this.setProject(project, user),
      getProject: (id) => this.getProject(id, user)
    }
  }

}


export default UsersStore
