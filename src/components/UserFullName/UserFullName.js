import {AccountCircle} from "@material-ui/icons";
import './UserFullName.css'
import React from "react";
import {Link} from "react-router-dom";
import {Avatar} from "@material-ui/core";
import Box from "@material-ui/core/Box";

export default function UserFullName(props) {


  let fullName = props.user.username
  if (props.user.first_name) {
    fullName = props.user.first_name
    if (props.user.last_name) fullName += ' ' + props.user.last_name
  }

  const letters = fullName? fullName.split(' ').map(s => s[0]) : <AccountCircle fontSize={"small"}/>

  return (
    <Link to={'/user/' + props.user.username + '/'} style={{textDecoration: 'none', color: 'black'}}>
      <div className={'user-full-name'}>
        <Box><Avatar className={'user-full-name-avatar'}>{letters}</Avatar></Box>
        <Box>{fullName}</Box>
      </div>
    </Link>
  )
}