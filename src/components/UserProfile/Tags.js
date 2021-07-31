import {ListItem} from "@material-ui/core";
import Tag from "../Tag/Tag";
import React from "react";

export default function Tags({user, tags, tagProps}) {
  if (!tags && !!user) tags = user.tags
  if (!tags) return null
  return (
    <ListItem style={{display: "flex", flexWrap: 'wrap'}} className={'tags-list'}>
      {tags.map(tag => <Tag tag={tag} key={tag.id} {...tagProps}/>)}
    </ListItem>
  )
}
