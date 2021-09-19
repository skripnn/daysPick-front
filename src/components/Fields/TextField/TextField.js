import {default as MuiTextField } from "@material-ui/core/TextField";
import React from "react";

export default function TextField({onChange, changeName, value, readOnly, emptyNull, ...props}) {

  function handleChange(e) {
    const value = emptyNull ? e.target.value || null : e.target.value
    onChange(changeName ? Object.fromEntries([[changeName, value]]) : value)
  }

  return (
    <MuiTextField
      inputProps={{disabled: readOnly ? true : undefined}}
      InputProps={{disableUnderline: !!readOnly}}
      InputLabelProps={{style: {whiteSpace: 'nowrap'}}}
      color={'secondary'}
      size="small"
      fullWidth
      autoComplete='off'
      value={value || ''}
      onChange={onChange ? handleChange : undefined}
      {...props}
    />
  )
}
