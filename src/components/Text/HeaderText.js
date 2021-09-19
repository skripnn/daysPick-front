import {Typography} from "@material-ui/core";
import React from "react";
import ActionButton from "../Actions/ActionButton/ActionButton";
import './Text.css'

export default function HeaderText({children, center, button, id, activeTab, setTab, ...props}) {
  if (button) {
    return (
      <ActionButton
        className={'header-text button'}
        big
        key={id}
        label={children}
        active={id === activeTab}
        onClick={() => setTab(id)}
        {...props}
      />
    )
  }

  return (
    <Typography className={`header-text item ${center ? 'center' : ''}`} {...props}>{children}</Typography>
  )
}
