import {url, checkAuth, requestAuthHeaders} from "./core";


export async function getUsers(obj={}) {
  let urlGet = `${url}/users/?`
  if (obj.filter) urlGet += `&filter=${obj.filter}`
  if (obj.days) {
    for (const day of obj.days)
      urlGet += `&days=${day}`
  }
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}