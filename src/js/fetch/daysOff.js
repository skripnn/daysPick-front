import {url, checkAuth, requestAuthHeaders} from "./core";


export async function getDaysOff() {
  let urlGet = url + "/daysoff/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}

export async function postDaysOff(day) {
  let urlPost = url + "/daysoff/"
  return fetch(urlPost, {
    method: 'POST',
    headers: requestAuthHeaders(),
    body: JSON.stringify(day)
  }).then(res => checkAuth(res))
}