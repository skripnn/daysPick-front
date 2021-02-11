import {url, checkAuth, requestAuthHeaders} from "./core";


export async function getClients() {
  let urlGet = url + "/clients/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function getClient(id) {
  let urlGet = `${url}/client/${id}/`
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function postClient(client) {
  let urlPost = url + "/client/"
  if (client.id) urlPost += client.id + "/"
  return fetch(urlPost, {
    method: 'POST',
    headers: requestAuthHeaders(),
    body: JSON.stringify(client)
  }).then(res => checkAuth(res))
}

export async function deleteClient(id) {
  let urlDelete = url + "/client/" + id + "/"
  return fetch(urlDelete, {
    method: 'DELETE',
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}