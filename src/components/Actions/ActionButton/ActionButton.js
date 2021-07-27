import Button from "@material-ui/core/Button";
import React from "react";
import './ActionButton.css'
import {Badge, CircularProgress, withStyles} from "@material-ui/core";
import Fetch from "../../../js/Fetch";
import IconBadge from "../../IconBadge/IconBadge";

export default function ActionButton(props) {
  if (props.hidden) return null

  const className = props.className + " action-button" + (props.active? " pick" : (props.red? " red" : ""))
  const onClick = props.link? () => Fetch.autoLink(props.link) : props.onClick
  const icon = props.badge
    ? <IconBadge content={props.badge}>{props.icon}</IconBadge>
    : props.icon

  return (
    <Button size={"small"} onClick={onClick} className={className} disabled={props.disabled}>
      <div className={"action-button"}>
        {props.loading? <CircularProgress size={24} color={'inherit'}/> : icon}
        {props.label}
      </div>
    </Button>
  )
}

export const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  },
}))(Badge);
