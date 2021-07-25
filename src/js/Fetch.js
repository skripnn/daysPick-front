import mainStore from "../stores/mainStore";
import Keys from "./Keys";
import Info from "./Info";


class FetchClass {
  host = Keys.fetchHost
  url = `${this.host}/api/`
  history = null

  errorAlert = (e) => {
    Info.loading(false)
    return Info.error(e.name === 'TypeError' ? 'Нет связи с сервером' : e.message)
  }

  authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("Authorization")
  })

  checkAuth = (res, redirect) => {
    Info.loading(false)
    if (redirect && res.status === 401) {
      localStorage.removeItem('User')
      window.location.href = "/login/"
      return
    }
    if (res.status === 200) return res.json()
    return Info.error(`${res.status} ${res.statusText}`)
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
    }).then(
      res => this.checkAuth(res, auth),
      this.errorAlert
    )
  }

  post = (URLs, data={}, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(
      res => this.checkAuth(res, auth),
      this.errorAlert
    )
  }

  postForm = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'POST',
      headers: {'Authorization': localStorage.getItem("Authorization")},
      body: data
    }).then(
      res => this.checkAuth(res, auth),
      this.errorAlert
    )
  }

  put = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(
      res => this.checkAuth(res, auth),
      this.errorAlert
    )
  }

  delete = (URLs, data, auth=true) => {
    return fetch(this.path(URLs), {
      method: 'DELETE',
      headers: this.authHeaders(),
      body: JSON.stringify(data)
    }).then(
      res => this.checkAuth(res, auth),
      this.errorAlert
    )
  }

  getFromUrl = () => this.get(window.location.pathname)

  getCalendar = (dateStart, dateEnd, user, project) => this.get('calendar', {
    start: dateStart.format(),
    end: dateEnd.format(),
    user: Array.isArray(user) ? undefined : user,
    users: Array.isArray(user) ? user : undefined,
    project_id: project
  })

  link = (link, set) => {
    Info.loading(true)
    if (link instanceof Array) link = link.filter(v => !!v).join('/')
    let l = link
    if (l !== '/') {
      if (l.startsWith('/')) l = l.slice(1)
      if (l.endsWith('/')) l = l.slice(0, l.length - 1)
    }
    const pushLink = l === '/'? l : `/${l}/`
    const toHistory = () => {
      this.history ? this.history.push(pushLink) : window.history.push(pushLink)
      Info.loading(false)
      window.scrollTo(0, 0)
    }
    if (!set) toHistory()
    else this.get(l).then(set).then(toHistory)
  }

  autoLink = (link) => {
    if (link === '/') link = localStorage.User? `@${localStorage.User}` : 'search'
    if (link instanceof Array) link = link.filter(v => !!v).join('/')
    if (link.search(/projects/) > -1) mainStore.ProjectsPageStore.clear()
    else if (link.startsWith('@')) this.link(link, mainStore.UsersStore.setUser)
    else if (link.search(/user\//) > -1) this.link(link, mainStore.UsersStore.setUser)
    else this.link(link)
  }

  back = () => {
    this.history? this.history.goBack() : window.history.goBack()
  }
}

const Fetch = new FetchClass()
export default Fetch
