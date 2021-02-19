import React from "react";
import TextField from "../TextField/TextField";
import {IconButton, InputAdornment} from "@material-ui/core";
import RefreshIcon from "../../Icons/RefreshIcon";
import MuiPhoneNumber from "material-ui-phone-number";


export default function ValidateTextField(props) {
  function handleChange(e) {
    let value = e.target.value
    if (props.convertValue) value = props.convertValue(value)
    if (value === props.defaultValue) value = null
    props.onChange(value)
  }

  return (
    <TextField
      disabled={props.disabled}
      label={props.label}
      name={props.name}
      onChange={handleChange}
      onBlur={props.value ? props.onBlur : undefined}
      error={!!props.error}
      helperText={props.helperText || props.error}
      value={props.value || props.defaultValue || ''}
      onKeyDown={(e) => {
        if (e.key === 'Escape') props.cancel()
      }}
      InputProps={!!props.value ? {
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={props.cancel} size={'small'}>
            <RefreshIcon />
          </IconButton>
        </InputAdornment>,
      } : undefined}
    />
  )
}

export function ValidatePhoneField(props) {
  function handleChange(value) {
    if (props.convertValue) value = props.convertValue(value)
    if (value === props.defaultValue || value === '+7') value = null
    props.onChange(value)
  }

  const helperText = <>Для подтверждения используется Telegram</>

  return (
    <MuiPhoneNumber
      countryCodeEditable={false}
      defaultCountry={'ru'}
      onlyCountries={['ru']}
      size="small"
      fullWidth
      autoComplete='off'
      disabled={props.disabled}
      label={props.label}
      name={props.name}
      onChange={handleChange}
      onBlur={props.value ? props.onBlur : undefined}
      error={!!props.error}
      helperText={(props.value || !props.defaultValue) ? props.error || helperText : undefined}
      value={props.value || props.defaultValue || ''}
      onKeyDown={(e) => {
        if (e.key === 'Escape') props.cancel()
      }}
      InputProps={!!props.value ? {
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={() => props.cancel('phone')} size={'small'}>
            <RefreshIcon />
          </IconButton>
        </InputAdornment>,
      } : {}}
    />)
}