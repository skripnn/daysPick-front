import './UserFullName.css'
import React from "react";
import Box from "@material-ui/core/Box";
import UserAvatar from "../UserAvatar/UserAvatar";
import {Publish} from "@material-ui/icons";
import {IconButton, Tooltip} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import {inject, observer} from "mobx-react";

function UserFullName(props) {
  if (!props.user.full_name) return null

  function click() {
    if (props.link) Fetch.link(`/user/${props.user.username}/`, props.setUser)
  }

  return (
    <div className={'user-full-name'} onClick={click}>
      {props.avatar === 'left' && <Box><UserAvatar {...props.user} onClick={props.avatarClick}/></Box>}
      <Box>{props.user.full_name}</Box>
      {props.avatar === 'right' && <Box><UserAvatar {...props.user} onClick={props.avatarClick}/></Box>}
      {props.raise && props.user.can_be_raised &&
      <Tooltip title={'Поднять в поиске'}>
        <IconButton size={"small"}
                    onClick={() => Fetch.get(['profile', 'raise']).then(props.setUser)}>
            <Publish className={"edit-button"}/>
        </IconButton>
      </Tooltip>
      }
    </div>
  )
}

export default inject(stores => ({
  setUser: stores.UsersStore.setUser
}))(observer(UserFullName))
