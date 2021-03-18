// const localhost = "localhost"
const localhost = "192.168.31.71"
// const localhost = "192.168.0.218"
// const localhost = "192.168.0.109"
// const localhost = "172.20.10.11"


class FetchClass {
  host = `${process.env.NODE_ENV === 'production' ? '' : `http://${localhost}:8000`}`
  url = `${process.env.NODE_ENV === 'production' ? '' : `${this.host}`}/api/`
  history = null

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
    if (typeof URLs === 'string' && URLs.startsWith('http')) path = URLs
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  fromBase64 = data => {
    let arr = data.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type:mime});
  }

  getImage = async (path) => {
    return await this.toBase64(await fetch(Fetch.host + path).then(r => r.blob()))
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

  postForm = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'POST',
      headers: {'Authorization': localStorage.getItem("Authorization")},
      body: data
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

  link = (link, set) => {
    const pushLink = (link.startsWith('/') && link.endsWith('/')) ? link : `/${link}/`
    const toHistory = () => this.history? this.history.push(pushLink) : window.history.push(pushLink)
    if (!set) toHistory()
    else this.get(link).then(set).then(toHistory)
  }
}

const Fetch = new FetchClass()
export default Fetch