import SearchField from "../components/Fields/SearchField/SearchField";
import React, {useState} from "react";
import {List, ListSubheader,} from "@material-ui/core";
import {getUsers} from "../js/fetch/users";
import UserItem from "../components/UserItem/UserItem";


export default function SearchPage() {
  const [users, setUsers] = useState(null)

  return (
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset"}}>
          <SearchField get={getUsers} set={setUsers} placeholder={"Кого искать?"}/>
        </ListSubheader>
      {users && users.map(user => <UserItem user={user} key={user.username}/>)}
      </List>
  )
}
