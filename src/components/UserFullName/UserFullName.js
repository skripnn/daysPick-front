import './UserFullName.css'
import React from "react";
import Box from "@material-ui/core/Box";
import {Publish} from "@material-ui/icons";
import {IconButton, Tooltip} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import Info from "../../js/Info";
import A from "../core/A";
import {useAccount} from "../../stores/storeHooks";


export function ProfileFullName({profile, leftChildren, rightChildren, link}) {
  if (!profile) return null

  return (
    <div className={'user-full-name'}>
      {leftChildren}
      <A link={link ? `@${profile.username}` : undefined}>
        <Box>{profile.full_name}</Box>
      </A>
      {rightChildren}
    </div>
  )
}


export function RaiseButton() {
  const {can_be_raised, setValue} = useAccount().can_be_raised

  if (!can_be_raised) return null
  return (
    <Tooltip title={'Поднять в поиске'}>
      <IconButton size={"small"}
                  onClick={() => Fetch
                    .post('account', {raised: true})
                    .then(setValue)
                    .then(() => Info.success('Профиль поднят в поиске'))}>
        <Publish className={"colored-button"}/>
      </IconButton>
    </Tooltip>
  )
}
