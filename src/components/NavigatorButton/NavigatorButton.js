import Button from "@material-ui/core/Button";
import React from "react";

export default function NavigatorButton(props) {
  const className = "navigator-button" + (props.active? " pick" : (props.red? " red" : ""))

  return (
    <Button size={"small"} onClick={props.onClick} className={className}>
      <div className={"navigator-button"}>
        {props.icon}
        {props.label}
      </div>
    </Button>
  )
}