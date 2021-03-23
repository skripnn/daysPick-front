import Button from "@material-ui/core/Button";
import React from "react";
import './ActionButton.css'
import {CircularProgress} from "@material-ui/core";
import Fetch from "../../../js/Fetch";

export default function ActionButton(props) {
  if (props.hidden) return null

  const className = "action-button" + (props.active? " pick" : (props.red? " red" : ""))
  const onClick = props.link? () => Fetch.autoLink(props.link) : props.onClick

  return (
    <Button size={"small"} onClick={onClick} className={className} disabled={props.disabled}>
      <div className={"action-button"}>
        {props.loading? <CircularProgress size={24} color={'inherit'}/> : props.icon}
        {props.label}
      </div>
    </Button>
  )
}