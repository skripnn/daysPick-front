class Loader {
  timer

  set = (f, timeout=500) => {
    clearTimeout(this.timer)
    this.timer = setTimeout(f, timeout)
  }
}

export default new Loader()