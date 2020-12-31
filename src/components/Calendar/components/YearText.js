import React from "react";

function YearText(props) {

  return (
    <span className='calendar-text'
          style={{minWidth: props.width}}
          children={props.width >= 48? props.year : undefined}/>
  )
}

export default YearText