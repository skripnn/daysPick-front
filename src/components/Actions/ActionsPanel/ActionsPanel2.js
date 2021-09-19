import {ListItem} from "@material-ui/core";
import React from "react";

export default function ActionsPanel2({children}) {
  return (
    <ListItem className={'item actions-panel-2'}>
      {children}
    </ListItem>
  )
}
