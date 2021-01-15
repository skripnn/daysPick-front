import React from "react";
import "../NavigatorButton/NavigatorButton.css"

import "./ProjectPageNavigator.css"

export default function ProjectPageNavigator(props) {

  if (props.bottom) return (
    <div className={'user-page-navigator bottom'}>
      {props.childrenL}
      {props.childrenR}
    </div>
  )

  return (
    <div className={'user-page-navigator'}>
      <div>
        {props.childrenL}
      </div>
      <div>
        {props.childrenR}
      </div>
    </div>
  )
}