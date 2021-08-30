import './UserFullName.css'
import React from "react";
import Box from "@material-ui/core/Box";
import UserAvatar from "../UserAvatar/UserAvatar";
import {Publish} from "@material-ui/icons";
import {IconButton, Tooltip} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import {inject, observer} from "mobx-react";
import IconBadge from "../IconBadge/IconBadge";

function UserFullName(props) {
  if (!props.user.full_name) return null

  function click() {
    if (props.link) Fetch.link(`@${props.user.username}/`, props.setUser)
  }

  const avatar = (
    <Box>
      <IconBadge dot content={props.badge}>
        <UserAvatar {...props.user} onClick={props.avatarClick}/>
      </IconBadge>
    </Box>
  )

  return (
    <div className={'user-full-name'} onClick={click}>
      {props.avatar === 'left' && avatar}
      <Box>{props.user.full_name}</Box>
      {props.avatar === 'right' && avatar}
      {props.raise && props.AccountStore.can_be_raised &&
      <Tooltip title={'Поднять в поиске'}>
        <IconButton size={"small"}
                    onClick={() => Fetch.post('account', {raised: true}).then(props.AccountStore.setValue)}>
            <Publish className={"edit-button"}/>
        </IconButton>
      </Tooltip>
      }
    </div>
  )
}

UserFullName.defaultProps = {
  badge: false
}

export default inject('AccountStore')(observer(UserFullName))
