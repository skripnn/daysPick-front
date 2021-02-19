import {url, checkAuth, requestAuthHeaders} from "./core";


export async function getProjects(user, obj={}) {
  let urlGet = url + `/projects/?user=${user}`
  if (obj.filter) urlGet += `&filter=${obj.filter}`
  if (obj.days) {
    for (const day of obj.days)
      urlGet += `&days=${day}`
  }
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => res.json())
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