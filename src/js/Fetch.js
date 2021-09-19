import mainStore from "../stores/mainStore";
import Keys from "./Keys";
import Info from "./Info";
import {getId} from "./functions/functions";


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
      localStorage.clear()
      window.open(window.location.href,"_self")
      return
    }
    if (res.status === 200) return res.json()
    Info.error(`${res.status} ${res.statusText}`)
    return null
  }

  path = (URLs, params) => {
    if (URLs instanceof Array) URLs = URLs.filter(v => !!v).join('/')
    if (URLs.startsWith('/')) URLs = URLs.slice(1)
    URLs = URLs.split('?')
    const paramsFromURL = URLs.length > 1 ? URLs[1] : null
    let path = this.url + URLs[0]
    if (!path.endsWith('/')) path += '/'
    // if (path.endsWith('/')) path = path.slice(0, path.length - 1)
    if (typeof URLs === 'string' && URLs.startsWith('http')) path = URLs
    if (params || paramsFromURL) {
      path += '?'
      if (params) {
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
      if (paramsFromURL) path += paramsFromURL
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

  get = (URLs, params, auth=true) => {
    return fetch(this.path(URLs, params, false), {
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

  getFromUrl = () => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    return this.get(window.location.pathname.slice(1), params)
  }

  getCalendar = (dateStart, dateEnd, user, project) => this.get('calendar', {
    start: dateStart.format(),
    end: dateEnd.format(),
    user: Array.isArray(user) ? undefined : user,
    users: Array.isArray(user) ? user : undefined,
    project_id: project
  })

  calendarGetter = (user, project) => {
    if (!user) return null
    return (start, end) => this.getCalendar(start, end, getId(user), getId(project))
  }

  getOffersCalendar = (dateStart, dateEnd) => this.get('calendar', {
    start: dateStart.format(),
    end: dateEnd.format(),
    offers: 1
  })

  linkConvert = (link) => {
    if (link instanceof Array) link = link.filter(v => !!v).join('/')
    let l = link
    if (l !== '/') {
      if (l.startsWith('/')) l = l.slice(1)
      if (l.endsWith('/')) l = l.slice(0, l.length - 1)
    }
    return l === '/'? l : `/${l}`
  }

  link = (link, set, replace=false) => {
    Info.loading(true)
    const pushLink = this.linkConvert(link)
    const toHistory = () => {
      if (replace) this.history ? this.history.replace(pushLink) : window.history.replace(pushLink)
      else this.history ? this.history.push(pushLink) : window.history.push(pushLink)
      Info.loading(false)
      window.scrollTo(0, 0)
    }
    if (!set) toHistory()
    else this.get(link).then(set).then(toHistory)
  }

  autoLink = (link, replace) => {
    if (link instanceof Array) link = link.filter(v => !!v).join('/')
    if (link.search(/projects/) > -1) this.link(link, mainStore.ProjectsPage.fullList.set)
    else if (link.search(/offers/) > -1) this.link(link, mainStore.OffersPage.fullList.set)
    else if (link.match(/^\/?project/)) this.link(link, mainStore.ProjectPage.setValue)
    else if (link.match(/^\/?@/)) this.link(link, mainStore.UserPage.setValue)
    else this.link(link, null, replace)
  }

  back = () => {
    this.history? this.history.goBack() : window.history.goBack()
  }

  hotLink = (link) => {
    window.location.pathname = this.linkConvert(link)
  }

  getSetter(link) {
    if (link instanceof Array) link = link.filter(v => !!v).join('/')
    if (link.search(/projects/) > -1) return mainStore.ProjectsPage.fullList.set
    if (link.match(/^\/?project/)) return mainStore.ProjectPage.download
    if (link.search(/offers/) > -1) return mainStore.OffersPage.fullList.set
    if (link.match(/^\/?@/)) return mainStore.UserPage.setValue
    return null
  }

}

const Fetch = new FetchClass()
export default Fetch
