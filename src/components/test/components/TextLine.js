import React from "react";

function TextLine(props) {
  // React.component - блок названий месяцев или лет
  return (
    <div className="calendar-text-line" children={props.children}/>
  )
}

export default TextLine