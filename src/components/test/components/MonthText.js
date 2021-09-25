import React from "react";

function MonthText(props) {
  // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  return (
    <span className="calendar-text"
          style={{minWidth: props.width}}
          children={props.width >= 48? <span>{monthNames[props.month]}</span>: undefined}/>
  )
}
export default MonthText
