import {checkAuth, requestAuthHeaders, url} from "./core";

export async function getUser(username) {
  let urlGet = url + "/user/" + username + "/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getPosition(position) {
  let urlGet = `${url}/position/${position}/`
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function addPosition(position) {
  let urlPut = `${url}/position/${position}/`
  return fetch(urlPut, {
    method: 'PUT',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function deletePosition(position) {
  let urlDelete = `${url}/position/${position}/`
  return fetch(urlDelete, {
    method: 'DELETE',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}