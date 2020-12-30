import React, {useEffect, useState} from "react";
import './UserProfile.css'


function ProfileRow(props) {
  return (
    <div>
      <div>{props.label}:</div>
      <div>{props.value}</div>
    </div>
  )
}

export default function UserProfile(props) {
  const [state, setState] = useState(props.user)
  useEffect(() => {setState(props.user)},[props])

  return (
    <div className={'user-profile'}>
      <ProfileRow label={'Username'} value={state.username}/>
      <ProfileRow label={'Имя'} value={state.first_name}/>
      <ProfileRow label={'Фамилия'} value={state.last_name}/>
    </div>
  )
}