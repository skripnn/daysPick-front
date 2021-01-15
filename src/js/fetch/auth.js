import {url, checkAuth} from "./core";


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
