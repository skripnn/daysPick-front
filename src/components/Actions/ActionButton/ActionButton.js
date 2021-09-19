import Button from "@material-ui/core/Button";
import React, {forwardRef} from "react";
import './ActionButton.css'
import {CircularProgress} from "@material-ui/core";
import IconBadge from "../../IconBadge/IconBadge";
import A from "../../core/A";
import Fetch from "../../../js/Fetch";

function ActionButton(props, ref) {
  if (props.hidden) return null

  const className = "action-button"
    + (props.active? " pick" : (props.red? " red" : ""))
    + (props.border ? ' border' : '')
    + (props.empty ? ' empty' : '')
    + (props.className? ` ${props.className}` : '')
  const icon = props.badge
    ? <IconBadge content={props.badge}>{props.icon}</IconBadge>
    : props.icon

  const button = (
    <Button size={props.big ? undefined : "small"} onClick={props.onClick} className={className} disabled={props.disabled || props.empty}>
      <div className={"action-button"}>
        {props.loading? <CircularProgress size={24} color={'inherit'}/> : icon}
        {props.label}
      </div>
    </Button>
  )

  return (
    <div className={'action-button-wrapper'} ref={ref}>
      {!props.link && !props.wrapper && button}
      {!!props.link && <A link={props.link} setter={Fetch.getSetter(props.link)}>{button}</A>}
      {!!props.wrapper && React.cloneElement(props.wrapper, {children: button})}
    </div>
  )
}

export default forwardRef(ActionButton)

