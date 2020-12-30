import {AccountCircle} from "@material-ui/icons";
import './UserFullName.css'
import React from "react";
import {Link} from "react-router-dom";

export default function UserFullName(props) {

  const fullName = (user) => {
    let name = user.username
    if (user.first_name) {
      name = user.first_name
      if (user.last_name) name += ' ' + user.last_name
    }
    return name
  }

  return (
    <Link to={'/user/' + props.user.username + '/'} style={{textDecoration: 'none', color: 'black'}}>
      <div className={'user-full-name'}>
        <AccountCircle fontSize={"small"}/>
        {fullName(props.user)}
      </div>
    </Link>
  )
}