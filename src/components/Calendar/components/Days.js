import React from "react";

function Days(props) {
  return (
    <div className="calendar-days"
         children={props.children} ref={props.ref}/>
  )
}

export default Days