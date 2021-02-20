import {url, checkAuth, requestAuthHeaders} from "./core";


export async function postLogIn(obj) {
  console.log(obj)
  let urlPost = `${url}/login/`
  return fetch(urlPost, {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function postSignUp(obj) {
  console.log(obj)
  let urlPost = `${url}/signup/`
  return fetch(urlPost, {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: requestAuthHeaders(),
  }).then(res => checkAuth(res))
}

export async function getCheckUsername(username) {
  let urlGet = url + "/signup/?username=" + username
  return fetch(urlGet).then(res => checkAuth(res))
}

export async function getCheckEmail(email) {
  let urlGet = url + "/signup/?email=" + email
  return fetch(urlGet).then(res => checkAuth(res))
}

export async function getCheckPhone(phone) {
  let urlGet = url + "/signup/?phone=" + phone
  return fetch(urlGet).then(res => checkAuth(res))
}