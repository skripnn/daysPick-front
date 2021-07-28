import {ListItem} from "@material-ui/core";
import Tag from "../Tag/Tag";
import React from "react";

export default function Tags({user}) {
  return (
    <ListItem style={{display: "flex", flexWrap: 'wrap'}} className={'tags-list'}>
      {user.tags.map(tag => <Tag tag={tag} key={tag.id}/>)}
    </ListItem>
  )
}
