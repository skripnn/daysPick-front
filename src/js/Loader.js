export class Loader {
  timer

  set = (f, timeout=500) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(f, timeout)
  }

  clear = () => clearTimeout(this.timer)

}

export default new Loader()