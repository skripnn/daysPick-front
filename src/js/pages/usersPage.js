import React, {useEffect, useState} from "react";
import {getFromUrl} from "../functions/fetch";
import {Link} from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() =>{
    getFromUrl().then(result => {
      if (result.length === 1) window.location.href = "/user/" + result[0].username + "/"
      else setUsers(result)
    })
  },[])

  return (
    <ul>
      {users.map((user) => <li key={user.username}><Link to={"/user/" + user.username + "/"}>{user.username}</Link></li>)}
    </ul>
  )
}