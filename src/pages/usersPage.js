import React, {useEffect, useState} from "react";
import {getFromUrl} from "../js/fetch/core";
import {Link, Redirect} from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() =>{
    getFromUrl().then(result => setUsers(result))
  },[])

  if (users.length === 1) return <Redirect to={"/user/" + users[0].username + "/"}/>

  return (
    <ul>
      {users.map((user) => <li key={user.username}><Link to={"/user/" + user.username + "/"}>{user.username}</Link></li>)}
    </ul>
  )
}