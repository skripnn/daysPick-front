import {newDate} from "./date";

export function actualProjects(projects) {
  let actualProjects = []
  let today = newDate()
  projects.forEach(project => {
    if (!project.is_paid || newDate(project.date_end) >= today) actualProjects.push(project)
  })
  return actualProjects
}

export function LocalUser() {
  if (localStorage.User) return localStorage.User
  window.location.href = '/'
}

export function checkUser() {
  const user = parseUser()
  if (user !== localStorage.getItem("User")) return true
}

export function parseUser(username) {
  const user = window.location.pathname.match(/\/user\/(.*)\/(\/?)/)
  if (user) return user[1]
  else if (username) return username
  return null
}

export function getProjectId() {
  const id = window.location.pathname.match(/\/project\/(.*)\//)
  if (id) return Number(id[1])
  return null
}

export function isMobil() {
  return document.body.clientWidth < 720
}

export function convertClients(clients=[]) {
  const list = [{company: null, clients: []}]
  clients.forEach(c => {
    if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
    list[list.length - 1].clients.push(c)
  })
  return list
}