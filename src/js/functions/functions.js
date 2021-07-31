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
  const match = window.location.pathname.match(/\/(user\/(?<username>[0-9a-z_]*))|(@(?<usernamePrefix>[0-9a-z_]*))\/?/)
  if (!!match.groups.username) return match.groups.username
  if (!!match.groups.usernamePrefix) return match.groups.usernamePrefix
  if (username) return username
  return null
}

export function getProjectId() {
  const id = window.location.pathname.match(/\/project\/([0-9]*)\/?/)
  if (id) return Number(id[1])
  return null
}

export function isMobil() {
  return document.body.clientWidth < 600
}

export function convertClients(clients=[]) {
  const list = [{company: null, clients: []}]
  clients.forEach(c => {
    if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
    list[list.length - 1].clients.push(c)
  })
  return list
}

export function formatDate(d) {
  return d[8] + d[9] + '.' + d[5] + d[6] + '.' + d[2] + d[3]
}
