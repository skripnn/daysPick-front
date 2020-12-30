// const localhost = "http://192.168.0.216:8000"
const localhost = "http://192.168.31.71:8000"
// const localhost = "http://localhost:8000"
const url = `${process.env.NODE_ENV === 'production' ? '' : localhost}/api`

function requestAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("Authorization")
  }
}

function checkAuth(res) {
  if (res.status === 401) {
    localStorage.removeItem('User')
    window.location.href = "/login/"
    return
  }
  return res.json()
}

export async function getFromUrl() {
  let urlGet = window.location.pathname
  if (!urlGet.endsWith('/')) urlGet += '/'
  urlGet += window.location.search
  return fetch(url + urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getProjects() {
  return fetch(url, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getClientsOptions() {
  let urlGet = url + "/clientsoptions/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getProject(id) {
  let urlGet = url + "/project/" + id + "/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function postProject(project) {
  let urlPost = url + "/project/"
  if(project.id) urlPost += project.id + "/"
  urlPost += window.location.search
  return fetch(urlPost, {
    method: 'POST',
    headers: requestAuthHeaders(),
    body: JSON.stringify(project)
  }).then(res => checkAuth(res))
}

export async function deleteProject(id) {
  let urlDelete = url + "/project/" + id + "/"
  return fetch(urlDelete, {
    method: 'DELETE',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function postDaysOff(daysOff) {
  let urlPost = url + "/daysoff/"
  return fetch(urlPost, {
    method: 'POST',
    headers: requestAuthHeaders(),
    body: JSON.stringify(daysOff)
  }).then(res => checkAuth(res))
}

export async function getDaysOff() {
  let urlGet = url + "/daysoff/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function postLogIn(data) {
  let urlPost = url + "/login/"
  return fetch(urlPost, {
    method: 'POST',
    body: data
  }).then(res => checkAuth(res))
}

export async function postSignUp(data) {
  let urlPost = url + "/signup/"
  return fetch(urlPost, {
    method: 'POST',
    body: data
  }).then(res => checkAuth(res))
}

export async function getCheckUsername(username) {
  let urlGet = url + "/signup/?username=" + username
  return fetch(urlGet).then(res => checkAuth(res))
}

export async function getCalendar(dateStart, dateEnd, user, project) {
  let urlGet = url + "/calendar/?"
  urlGet += "&start=" + dateStart.format()
  urlGet += "&end=" + dateEnd.format()
  urlGet += "&user=" + user
  if (project) urlGet += "&project_id=" + project
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getProjectList() {
  let urlGet = url + "/projectlist/?"
  urlGet += "&user=" + window.location.pathname.match(/\/user\/(.*)\//)[1]
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}