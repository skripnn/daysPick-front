import React from "react";

function MonthText(props) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <span className="calendar-text"
          style={{minWidth: props.width}}
          children={props.width >= 48? monthNames[props.month] : undefined}/>
  )
}
export default MonthText