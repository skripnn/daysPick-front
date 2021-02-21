// const localhost = "localhost"
const localhost = "192.168.31.71"
// const localhost = "192.168.0.218"
// const localhost = "192.168.0.109"


class FetchClass {
  url = `${process.env.NODE_ENV === 'production' ? '' : `http://${localhost}:8000`}/api/`

  authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("Authorization")
  })

  checkAuth = (res, redirect) => {
    if (redirect && res.status === 401) {
      localStorage.removeItem('User')
      window.location.href = "/login/"
      return
    }
    if (res.status === 200) return res.json()
    return {error: `${res.status} ${res.statusText}`}
  }

  path = (URLs, params) => {
    if (URLs instanceof Array) URLs = URLs.filter(v => !!v).join('/')
    let path = this.url + URLs + '/'
    if (params) {
      path += '?'
      let list = []
      for (const [key, value] of Object.entries(params)) {
        if (!value) continue
        if (value instanceof Array) {
          for (const v of value) list.push(`${key}=${v}`)
        }
        else {
          list.push(`${key}=${value}`)
        }
      }
      path += list.join('&')
    }
    return path
  }

  get = (URLs, params={}, auth=true) => {
    return fetch(this.path(URLs, params), {
      headers: this.authHeaders()
    }).then(res => this.checkAuth(res, auth))
  }

  post = (URLs, data={}, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(res => this.checkAuth(res, auth))
  }

  put = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(res => this.checkAuth(res, auth))
  }

  delete = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'DELETE',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(res => this.checkAuth(res, auth))
  }

  getFromUrl = () => this.get(window.location.pathname)

  getCalendar = (dateStart, dateEnd, user, project) => this.get('calendar', {
    start: dateStart.format(),
    end: dateEnd.format(),
    user: user,
    project_id: project
  })
}

const Fetch = new FetchClass()
export default Fetch