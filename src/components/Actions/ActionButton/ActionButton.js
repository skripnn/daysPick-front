import Button from "@material-ui/core/Button";
import React from "react";
import {Link} from "react-router-dom";
import './ActionButton.css'

export default function ActionButton(props) {
  if (props.hidden) return null

  const className = "action-button" + (props.active? " pick" : (props.red? " red" : ""))

  const actionButton = (
    <Button size={"small"} onClick={props.onClick} className={className} disabled={props.disabled}>
      <div className={"action-button"}>
        {props.icon}
        {props.label}
      </div>
    </Button>
  )

  return props.link? <Link to={props.link} style={{textDecoration: 'none'}}>{actionButton}</Link> : actionButton
}