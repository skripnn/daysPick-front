import {newDate} from "./date";

export function noArchiveProjects(projects) {
  let actualProjects = []
  let today = newDate()
  projects.forEach(project => {
    for (let i=0; i < project.dates.length; i++) {
      if (!project.is_paid) {
        actualProjects.push(project)
        return
      }
      let date = newDate(project.dates[i])
      if (date >= today) {
        actualProjects.push(project)
        return
      }
    }
  })
  return actualProjects
}


export function checkUser() {
  const user = getUser()
  if (user !== localStorage.getItem("User")) return true
}

export function getUser(username) {
  const user = window.location.pathname.match(/\/user\/(.*)\//)
  if (user) return user[1]
  else if (username) return username
  return null
}

export function getProjectId() {
  const id = window.location.pathname.match(/\/project\/(.*)\//)
  if (id) return Number(id[1])
  return null
}