import React, {useEffect, useState} from "react";
import {CircularProgress, InputAdornment} from "@material-ui/core";
import ValidateTextField from "../ValidateTextField/ValidateTextField";
import IconButton from "@material-ui/core/IconButton";
import {Save} from "@material-ui/icons";
import './SaveTextField.css'
import RefreshIcon from "../../Icons/RefreshIcon";
import MuiPhoneNumber from "material-ui-phone-number";

function SaveTextField({defaultValue, label, name, validator, convertValue, onSave, onChange}) {
  const [value, setValue] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (value && !validator(value)) setError(true)
    else {
      setError(false)
      onChange(Object.fromEntries([[name, value]]))
    }
    //eslint-disable-next-line
  }, [value])

  useEffect(() => {
    setLoading(false)
    setValue(defaultValue)
    //eslint-disable-next-line
  }, [defaultValue])

  function handleClick() {
    setLoading(true)
    const obj = Object.fromEntries([[name, value === '' ? null : value]])
    onSave(obj)
  }

  const fieldProps = {
    label: label,
    name: name,
    value: value === defaultValue ? null : value,
    error: error? 'Неверный формат' : null,
    defaultValue: defaultValue,
    convertValue: convertValue,
    onChange: v => setValue(v === null ? defaultValue : (v === '' && defaultValue === null) ? null : v),
    cancel: () => setValue(defaultValue),
    onKeyDown: (e) => {
      if (e.key === 'Escape') setValue(defaultValue)
      if (e.key === 'Enter' && !error) handleClick()
    }
  }

  return (
    <div className={'field-wrapper'}>
      {name === 'phone' ? <PhoneField {...fieldProps} value={value} onChange={setValue}/> : <ValidateTextField {...fieldProps}/>}
      {value !== defaultValue && <SaveFieldButton onClick={handleClick} disabled={error} loading={loading}/>}
    </div>
  )
}

SaveTextField.defaultProps = {
  validator: () => true,
  onSave: () => {},
  onChange: () => {},
  convertValue: r => r
}

export default SaveTextField


function PhoneField({defaultValue, value, onChange, error, label, name, cancel, convertValue, ...props}) {
  return (
    <MuiPhoneNumber
      label={label}
      name={name}
      disableDropdown
      color={'secondary'}
      countryCodeEditable={false}
      defaultCountry={'ru'}
      onlyCountries={['ru']}
      size="small"
      fullWidth
      autoComplete='off'
      // defaultValue={defaultValue}
      onChange={(v) => onChange(v === '+7' ? null : convertValue(v))}
      error={!!error}
      helperText={error}
      value={value ? value : ''}
      InputProps={defaultValue !== value ? ({
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={cancel} size={'small'}>
            <RefreshIcon />
          </IconButton>
        </InputAdornment>,
      }) : undefined}
      {...props}
    />
  )
}

export function SaveFieldButton({onClick, disabled, loading}) {
  return (
    <div className={'save-text-field-button-wrapper'}>
      <IconButton size={'small'} onClick={onClick} disabled={disabled || loading}>
        <Save/>
        {loading && <CircularProgress className={'save-text-field-progress'} color={"inherit"} size={30}/>}
      </IconButton>
    </div>
  )
}
