// const localhost = "http://192.168.0.216:8000"
const localhost = "http://192.168.31.71:8000"
// const localhost = "http://192.168.0.109:8000"
// const localhost = "http://localhost:8000"

export const url = `${process.env.NODE_ENV === 'production' ? '' : localhost}/api`

export function requestAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("Authorization")
  }
}

export function checkAuth(res) {
  if (res.status === 401) {
    localStorage.removeItem('User')
    window.location.href = "/login/"
    return
  }
  if (res.status === 200) return res.json()
  return {error: `${res.status} ${res.statusText}`}
}


export async function getFromUrl() {
  let urlGet = window.location.pathname
  if (!urlGet.endsWith('/')) urlGet += '/'
  urlGet += window.location.search
  return fetch(url + urlGet, {headers: requestAuthHeaders()}).then(res => checkAuth(res))
}


class Fetch {

}

export default new Fetch()