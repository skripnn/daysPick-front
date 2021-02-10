import {newDate} from "./date";

export function noArchiveProjects(projects) {
  let actualProjects = []
  let today = newDate()
  projects.forEach(project => {
    if (!project.is_paid || newDate(project.date_end) >= today) actualProjects.push(project)
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