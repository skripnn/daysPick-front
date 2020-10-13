const url = "http://192.168.0.216:8000/api"
const request_dataGet = {
  headers: {
    'Authorization': 'Token 68957d6823388ee7c10d450045a100a3107e6c67'
  }
}

export function getFromUrl() {
  let urlGet = window.location.pathname
  if (!urlGet.endsWith('/')) urlGet += '/'
  if (window.location.pathname === '/') urlGet += 'admin/'
  if (urlGet !== '/admin/') urlGet += "?full"
  return fetch(url + urlGet, request_dataGet).then(res => res.json())
}

export function getProjects() {
  return fetch(url, request_dataGet).then(res => res.json())
}

export function getProject(id) {
  let urlGet = url + "/admin/project/" + id + "/"
  return fetch(urlGet, request_dataGet).then(res => res.json())
}

export function postProject(project) {
  let urlPost = url + "/admin/project/"
  urlPost += project.id? project.id + "/" : ""
  return fetch(urlPost, {
    method: 'POST',
    headers: {
      'Authorization': 'Token 68957d6823388ee7c10d450045a100a3107e6c67',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  }).then(res => res.json())
}

export function deleteProject(id) {
  let urlDelete = url + "/admin/project/" + id + "/"
  return fetch(urlDelete, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Token 68957d6823388ee7c10d450045a100a3107e6c67'
    }
  }).then(res => res.json())
}

export function postDaysOff(daysOff) {
  let urlPost = url + "/admin/daysoff/"
  return fetch(urlPost, {
    method: 'POST',
    headers: {
      'Authorization': 'Token 68957d6823388ee7c10d450045a100a3107e6c67',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(daysOff)
  }).then(res => res.json())
}

export function getDaysOff() {
  let urlGet = url + "/admin/daysoff/"
  return fetch(urlGet, request_dataGet).then(res => res.json())
}