import {default as MuiTextField } from "@material-ui/core/TextField";
import React from "react";

export default function TextField(props) {
  return (
    <MuiTextField
      color={'secondary'}
      size="small"
      fullWidth
      autoComplete='off'
      {...props}
    />
  )
}
