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
  if (!!match && match.groups.username) return match.groups.username
  if (!!match && match.groups.usernamePrefix) return match.groups.usernamePrefix
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

export function emailValidator(value) {
  return /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(value)
}

export function phoneValidator(value) {
  return /^\+7 \(9[0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)
}

export function getId(item) {
  return typeof item === 'number' || !item ? item : item.id
}

export function compareProfiles(a, b) {
  const _a = typeof a === 'string' || !a ? a : a.username
  const _b = typeof b === 'string' || !b ? b : b.username
  return _a === _b
}

export function compareId(a, b) {
  return getId(a) === getId(b)
}

export function getProjectStatus(project, asker) {
  if (!project.id) return null
  if (!project.confirmed) {
    if (compareId(project.creator, asker)) return 'Ожидание ответа'
    else {
      if (project.is_wait) return 'Новый проект'
      if (!project.is_wait) return 'Проект изменён'
    }
  }
  else if (compareId(project.canceled, project.creator)) return 'Отменён'
  else if (compareId(project.canceled, project.user)) return 'Отказ'
  return null
}


export function projectListTransform (projects=[]) {
  const array = []
  projects.forEach(p => {
    if (p.parent) {
      const indexFolder = array.findIndex(i => i.id === p.parent.id)
      if (indexFolder === -1) {
        array.push({...p.parent, dates: [...p.dates], date_start: p.date_start, date_end: p.date_end, children: [p], confirmed: true, is_series: true})
      }
      else {
        const parent = array[indexFolder]
        parent.dates = [...parent.dates, ...p.dates]
        parent.children.push(p)
        if (p.date_start < parent.date_start) parent.date_start = p.date_start
        if (p.date_end > parent.date_end) parent.date_end = p.date_end
        array[indexFolder] = parent
      }
    }
    else {
      array.push(p)
    }
  })
  return array.map(p => p.children && p.children.length === 1 ? p.children[0] : p)
}


export function isPromise(func) {
  return func && typeof func.then === 'function' && func[Symbol.toStringTag] === 'Promise';
}
