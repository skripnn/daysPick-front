import SearchField from "../components/Fields/SearchField/SearchField";
import React, {useState} from "react";
import {List, ListSubheader,} from "@material-ui/core";
import UserItem from "../components/UserItem/UserItem";
import Fetch from "../js/Fetch";


export default function SearchPage() {
  const [users, setUsers] = useState(null)

  return (
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}} disableSticky>
          <SearchField get={obj => Fetch.get('users', obj)} set={setUsers} placeholder={"Кого искать?"} autoFocus categoryFilter minFilter={3}/>
        </ListSubheader>
      {users && users.map(user => <UserItem user={user} key={user.username}/>)}
      </List>
  )
}
