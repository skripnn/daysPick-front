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

  add = (type, message) => {
    const obj = Object.fromEntries([[type, message]])
    mainStore.InfoBarStore.add(obj)
    return obj
  }

}

const Info = new InfoClass()
export default Info