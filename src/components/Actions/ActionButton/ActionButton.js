import Button from "@material-ui/core/Button";
import React, {forwardRef} from "react";
import './ActionButton.css'
import {CircularProgress} from "@material-ui/core";
import Fetch from "../../../js/Fetch";
import IconBadge from "../../IconBadge/IconBadge";

function ActionButton(props, ref) {
  if (props.hidden) return null

  const className = "action-button" + (props.active? " pick" : (props.red? " red" : "")) + (props.className? ` ${props.className}` : '')
  const onClick = props.link? () => Fetch.autoLink(props.link) : props.onClick
  const icon = props.badge
    ? <IconBadge content={props.badge}>{props.icon}</IconBadge>
    : props.icon

  return (
    <div className={'action-button-wrapper'} ref={ref}>
      <Button size={props.big ? undefined : "small"} onClick={onClick} className={className} disabled={props.disabled}>
        <div className={"action-button"}>
          {props.loading? <CircularProgress size={24} color={'inherit'}/> : icon}
          {props.label}
        </div>
      </Button>
    </div>
  )
}

export default forwardRef(ActionButton)
