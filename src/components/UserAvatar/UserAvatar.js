import {Avatar} from "@material-ui/core";
import React from "react";
import "./UserAvatar.css"
import Fetch from "../../js/Fetch";

export default function UserAvatar(props) {
  const path = props.avatar? Fetch.host + props.avatar : ' '
  const style = props.size? {width: props.size / 0.7, height: props.size / 0.7, paddingTop: 0} : {}
  if (props.onClick) style.cursor = 'pointer'

  return (
    <>
      <Avatar
        className={'user-avatar'}
        alt={props.full_name === '<DELETED>' ? ' ' : props.full_name}
        src={path}
        onClick={props.onClick}
        style={style}
      />
    </>
  )
}
