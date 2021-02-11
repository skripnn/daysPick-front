import {Avatar} from "@material-ui/core";
import React from "react";
import "./UserAvatar.css"

export default function UserAvatar(props) {
  return (
    <Avatar className={'user-avatar'} alt={props.user.full_name} src={"/avatar.jpg"}/>
  )
}