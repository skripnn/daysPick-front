import React from "react";
import "../NavigatorButton/NavigatorButton.css"

import "./UserPageNavigator.css"
import UserFullName from "../UserFullName/UserFullName";

export default function UserPageNavigator(props) {

  if (props.bottom) return (
    <div className={'user-page-navigator bottom'}>
      {props.children}
    </div>
  )

  return (
    <div className={'user-page-navigator'}>
      <UserFullName user={props.user}/>
      <div className={'user-page-navigator buttons-block'}>
        {props.children}
      </div>
    </div>
  )
}