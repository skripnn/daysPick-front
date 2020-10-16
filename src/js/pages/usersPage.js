import React, {useEffect, useState} from "react";
import {getFromUrl} from "../functions/fetch";
import {Link} from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() =>{
    getFromUrl().then(result => setUsers(result))
  },[])

  return (
    <ul>
      {users.map((user) => <li><Link to={"/user/" + user.username + "/"}>{user.username}</Link></li>)}
    </ul>
  )
}