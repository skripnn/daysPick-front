import Item from "../../Items/Item";
import {ProfileAvatar} from "../../UserAvatar/UserAvatar";
import ProfileItem from "../../Items/ProfileItem";
import ItemField from "./ItemField";
import React, {useState} from "react";
import Fetch from "../../../js/Fetch";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import CloseButton from "../../CloseButton/CloseButton";
import {ProfileFullName} from "../../UserFullName/UserFullName";
import {Profile} from "../../UserProfile/UserProfile";
import {useMobile} from "../../hooks";

export default function ProfileField({label, value, onChange, exclude, initDays={}, ...otherProps}) {
  const itemRender = (v) => (
    <Item
      avatar={<ProfileAvatar profile={v}/>}
      primary={v.full_name}
    />
  )
  const listRender = (list) => list.map(i => (
    <ProfileItem key={i.id.toString()} profile={i} onClick={() => onChange(i)} slim star/>
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
      searchFieldParams={{
        noFilter: false,
        initDays: initDays.length ? initDays : undefined,
      }}
      {...otherProps}
    />
  )
}

export function ProfileFieldViewer({label, value}) {
  const [state, setState] = useState(null)
  const [open, setOpen] = useState(false)
  const mobile = useMobile()

  function onClick() {
    if (!state) Fetch.get([`@${value.id}?profile`]).then(setState).then(() => setOpen(true))
    else setOpen(true)
  }

  const itemRender = (v) => (
    <Item
      avatar={<ProfileAvatar profile={v}/>}
      primary={v.full_name}
    />
  )

  return (<>
    <ItemField
      disabled
      label={label}
      value={state || value}
      itemRender={itemRender}
      onClick={onClick}
    />
    <Dialog
      maxWidth={'xs'}
      onClose={() => setOpen(false)}
      open={open}
      fullWidth
      fullScreen={mobile}
    >
      {!!state && <>
      <DialogTitle>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
          <ProfileFullName
            profile={state}
            leftChildren={<ProfileAvatar profile={state} dialog/>}
          />
          <CloseButton onClick={() => setOpen(false)}/>
        </div>
      </DialogTitle>
      <DialogContent>
        <Profile profile={state}/>
      </DialogContent>
      </>}
    </Dialog>
  </>)
}
