import mainStore from "../stores/mainStore";

class InfoClass {
  error = (message) => {
    if (!message || typeof message !== "string") {
      console.log(JSON.stringify(message))
      message = "Непредвиденная ошибка"
    }
    return this.add('error', message)
  }

  warning = (message) => {
    return this.add('warning', message)
  }

  info = (message) => {
    return this.add('info', message)
  }

  success = (message) => {
    return this.add('success', message)
  }

  confirm = (message, action) => {
    mainStore.InfoBar.setConfirm({message: message, action: action})
  }

  add = (type, message) => {
    const obj = Object.fromEntries([[type, message]])
    mainStore.InfoBar.add(obj)
    return obj
  }

  loading = (bool) => {
    mainStore.InfoBar.setLoading(bool)
  }

}

const Info = new InfoClass()
export default Info
