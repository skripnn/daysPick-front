class TouchHold {
  touch = false
  touchTimer
  actions = {}

  constructor(onTouchHold, onTouchEnd) {
    this.touchHold = onTouchHold
    this.onClick = onTouchEnd
    if (this.touchHold) this.actions = {
      onTouchEnd: this.touchEnd,
      onTouchStart: this.touchStart,
      onTouchMove: this.touchFalse,
      onTouchCancel: this.touchFalse,
    }
  }

  touchFalse = (e) => {
    if (e) e.preventDefault()
    this.touch = false
    clearTimeout(this.touchTimer)
  }

  touchEnd = (e) => {
    if (this.touch) this.touchFalse()
    if (this.onClick) {
      // e.preventDefault()
      this.onClick()
    }
  }

  touchStart = (e) => {
    this.touch = true
    clearTimeout(this.touchTimer)
    this.touchTimer = setTimeout(() => this.onTouchHold(e), 500)
  }

  onTouchHold = (e) => {
    this.touchFalse()
    if (this.touchHold) this.touchHold(e)
  }
}

export default TouchHold