import Item from "../../Items/Item";
import {ProfileAvatar} from "../../UserAvatar/UserAvatar";
import ProfileItem from "../../Items/ProfileItem";
import ItemField from "./ItemField";
import React from "react";

export default function ProfileField({label, value, onChange, exclude, ...otherProps}) {
  const itemRender = (v) => (
    <Item
      avatar={<ProfileAvatar profile={v}/>}
      primary={v.full_name}
    />
  )
  const listRender = (list) => list.map(i => (
    <ProfileItem key={i.id.toString()} profile={i} onClick={() => onChange(i)} slim/>
  ))

  return (
    <ItemField
      label={label}
      value={value}
      onChange={onChange}
      itemRender={itemRender}
      getLink={'users'}
      getParams={exclude ? {exclude: exclude} : undefined}
      listRender={listRender}
      {...otherProps}
    />
  )
}
