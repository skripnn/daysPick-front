import React from "react";
import "../NavigatorButton/NavigatorButton.css"

import "./ProjectPageNavigator.css"

export default function ProjectPageNavigator(props) {

  if (props.bottom) return (
    <div className={'user-page-navigator bottom'}>
      {props.children}
    </div>
  )

  return (
    <div className={'user-page-navigator'}>
      {props.children}
    </div>
  )
}