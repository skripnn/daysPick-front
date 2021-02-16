import {checkAuth, requestAuthHeaders, url} from "./core";

export async function getUser(username) {
  let urlGet = `${url}/user/${username}/`
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function postProfile(obj) {
  let urlPost = `${url}/profile/`
  return fetch(urlPost, {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function getPosition(position) {
  let urlGet = `${url}/profile/position/${position}/`
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function addPosition(position) {
  let urlPut = `${url}/profile/position/${position}/`
  return fetch(urlPut, {
    method: 'PUT',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function deletePosition(position) {
  let urlDelete = `${url}/profile/position/${position}/`
  return fetch(urlDelete, {
    method: 'DELETE',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}