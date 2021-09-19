import React from "react";
import ActionButton from "./ActionButton";

export default function ActionButton2({label, icon, ...otherProps}) {
  return (
    <ActionButton
      className={'action-button-2'}
      border
      label={
        <div className={'action-button-2-label'}>
          {icon}
          {label}
        </div>}
      {...otherProps}
    />
  )
}
