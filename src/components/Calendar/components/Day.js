import {newDate} from "../extention/date";
import React from "react";

function Day(props) {
  // React.component - день
  let touch = false
  let touchTimer

  function getDayCSS() {
    // Формирование css-класса дня из даты
    let result = "calendar-day"
    result += props.date.getMonth() % 2 === 0 ? " color0" : " color1"
    if (props.date < newDate()) result += " past"
    if (props.info) result += " busy"
    else if (props.off) result += " busy"
    if (props.pick) result += " pick"
    return result
  }

  function touchFalse () {
    touch = false
    clearTimeout(touchTimer)
  }

  function touchEnd(e) {
    if (touch) {
      touchFalse()
      e.preventDefault()
      onClick()
    }
  }

  function touchStart() {
    touch = true
    clearTimeout(touchTimer)
    touchTimer = setTimeout(onTouchHold, 500)
  }

  function onClick() {
    if (props.onClick) props.onClick(props.date)
  }

  function onTouchHold() {
    touchFalse()
    if (props.onTouchHold) props.onTouchHold(props.info, props.date)
  }

  function onMouseOver() {
    if (props.onMouseOver) props.onMouseOver(props.info, props.date)
  }

  function onContextMenu(e) {
    e.preventDefault()
    if (props.onContextMenu) props.onContextMenu(props.info, props.date)
  }

  return (
    <div
      className={getDayCSS()}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseOver={onMouseOver}
      onTouchEnd={touchEnd}
      onTouchStart={touchStart}
      onTouchMove={touchFalse}
      onTouchCancel={touchFalse}
    >
      {props.date.getDate().toString()}
    </div>
  )
}

export default Day