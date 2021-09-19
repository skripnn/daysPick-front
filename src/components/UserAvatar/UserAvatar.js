import {Avatar, Dialog, DialogContent} from "@material-ui/core";
import React, {useState} from "react";
import "./UserAvatar.css"
import Fetch from "../../js/Fetch";

export default function UserAvatar(props) {
  const path = props.avatar? Fetch.host + props.avatar : ' '
  const style = props.size? {width: props.size / 0.7, height: props.size / 0.7, paddingTop: 0} : {}
  if (props.onClick) style.cursor = 'pointer'

  return (
    <>
      <Avatar
        className={'user-avatar'}
        alt={props.full_name === '<DELETED>' ? ' ' : props.full_name}
        src={path}
        onClick={props.onClick}
        style={style}
      />
    </>
  )
}

export function ProfileAvatar({profile, dialog, size}) {
  const [image, setImage] = useState(null)
  const path = profile.avatar? Fetch.host + profile.avatar : ' '
  const style = size? {width: size / 0.7, height: size / 0.7, paddingTop: 0} : {}
  if (dialog) style.cursor = 'pointer'

  function onHandleClick() {
    if (dialog && profile.photo) Fetch.getImage(profile.photo).then(setImage)
  }

  return (
    <>
      <Avatar
        className={'user-avatar'}
        alt={profile.full_name === '<DELETED>' || profile.full_name.match(/^\d+$/) ? ' ' : profile.full_name}
        src={path}
        onClick={onHandleClick}
        style={style}
      />
      {dialog &&
      <Dialog
        open={!!image}
        onClose={() => setImage(null)}
        maxWidth={"sm"}
        scroll={'body'}
        style={{maxHeight: '95vh'}}
      >
        <DialogContent style={{padding: 10}}>
          <img src={image} style={{maxWidth: '100%', maxHeight: '100%'}} alt={profile.full_name}/>
        </DialogContent>
      </Dialog>
      }
    </>
  )
}
