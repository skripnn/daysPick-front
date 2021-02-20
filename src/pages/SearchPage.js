import SearchField from "../components/Fields/SearchField/SearchField";
import React, {useState} from "react";
import {List, ListSubheader,} from "@material-ui/core";
import UserItem from "../components/UserItem/UserItem";
import Fetch from "../js/Fetch";


export default function SearchPage() {
  const [users, setUsers] = useState(null)

  return (
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}}>
          <SearchField get={obj => Fetch.get('users', obj)} set={setUsers} placeholder={"Кого искать?"}/>
        </ListSubheader>
      {users && users.map(user => <UserItem user={user} key={user.username}/>)}
      </List>
  )
}
