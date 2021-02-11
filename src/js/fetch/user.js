import {checkAuth, requestAuthHeaders, url} from "./core";

export async function getUser(username) {
  let urlGet = url + "/user/" + username + "/"
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}