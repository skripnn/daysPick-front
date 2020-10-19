export function projectsToDays(projects, project) {
  // создание списка дат с проектами из списка проектов
  let days = {}
  projects.forEach(function (project) {
    project.dates.forEach(function (date) {
      if (days[date] === undefined) {
        days[date] = []
      }
      days[date].push(project.id)
    })
  })
  if (project) {
    excludeProjectFromDays(days, project)
  }
  return days
}

function excludeProjectFromDays(days, project) {
  for (let day in days) {
    if (days.hasOwnProperty(day)) {
      let i = days[day].findIndex(id => id === project.id)
      if (i !== -1) {
        days[day].splice(i, 1)
      }
      if (days[day].length === 0) {
        delete days[day]
      }
    }
  }
  return days
}

export function projectsSort(projects) {
  // сортировка проектов по дате начала
  projects.forEach((p) => p["start_date"] = new Date(p.dates[0]))
  projects.sort((a, b) => a.start_date > b.start_date ? 1 : -1)
  projects.forEach((p) => delete p.start_date)
  return projects
}

export function scrollCalendar(dates) {
  if (dates) {
    const left = document.getElementById(dates[0]).getBoundingClientRect().left
    let right = document.getElementById(dates[dates.length - 1]).getBoundingClientRect().left
    const center_document = document.body.getBoundingClientRect().width / 2
    const center_dates = (left + right) / 2
    if (center_dates > center_document) {
      let x = center_dates - center_document
      const offset = document.querySelector("div.calendar").getBoundingClientRect().left
      if (left - (center_dates - center_document) < offset) {
        x = left - offset - 14
      }
      document.querySelector("div.calendar").scrollTo(x, 0)
    }
  }
  else {
    const today = (new Date()).format()
    const main = document.getElementById("calendar-days")
    const l = document.getElementById(today).getBoundingClientRect().left - main.getBoundingClientRect().left
    main.scrollTo(l, 0)
  }
}

export function setUrl(state) {
  let url = "/admin/"
  if (state.project !== null) {
    url += "project/"
    if (state.project.id) url += state.project.id + "/"
  }
  if (window.location.pathname === "/admin/clients/") url = window.location.pathname
  // eslint-disable-next-line no-restricted-globals
  history.pushState(JSON.stringify(state), null, url)
}


export function archiveProjects(projects) {
  let archiveProjects = []
  let today = new Date()
  today.setUTCHours(0,0,0,0)
  projects.forEach(project => {
    if (project.status !== 'ok') return
    for (let i=0; i < project.dates.length; i++) {
      if (new Date(project.dates[i]) >= today) return
    }
    archiveProjects.push(project)
  })
  return archiveProjects
}

export function actualProjects(projects) {
  let actualProjects = []
  let today = new Date()
  today.setUTCHours(0,0,0,0)
  projects.forEach(project => {
    if (project.status !== 'ok') return
    for (let i=0; i < project.dates.length; i++) {
      if (new Date(project.dates[i]) >= today) {
        actualProjects.push(project)
        return
      }
    }
  })
  return actualProjects
}

export function newProjects(projects) {
  let newProjects = []
  projects.forEach(project => {
    if (project.status === 'new') newProjects.push(project)
  })
  return newProjects
}

export function updatedProjects(projects) {
  let updatedProjects = []
  projects.forEach(project => {
    if (project.status === 'updated') updatedProjects.push(project)
  })
  return updatedProjects
}

export function setClients(projects) {
  const clients = projects.map((project) => project.client)
  clients.sort()
  return Array.from(new Set(clients))
}

export function getHomeUrl() {
  const user = localStorage.getItem("User")
  console.log(localStorage)
  if (user) return "/user/" + user + "/"
  return "/login/"
}