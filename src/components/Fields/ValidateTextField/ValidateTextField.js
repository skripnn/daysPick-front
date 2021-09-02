import React, {useState} from "react";
import TextField from "../TextField/TextField";
import {IconButton, InputAdornment, Popover} from "@material-ui/core";
import RefreshIcon from "../../Icons/RefreshIcon";
import MuiPhoneNumber from "material-ui-phone-number";
import {InfoOutlined, Visibility, VisibilityOff} from "@material-ui/icons";
import {PopoverContent} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Loader from "../../../js/Loader";
import Fetch from "../../../js/Fetch";


export default function ValidateTextField(props) {
  const {onChange, value, defaultValue, onBlur, error, helperText, cancel, convertValue, endAdornment, ...newProps} = props

  function handleChange(e) {
    let value = e.target.value
    if (convertValue) value = convertValue(value)
    if (value === defaultValue) value = null
    if (onChange) onChange(value, props.name)
  }

  return (
    <TextField
      onChange={handleChange}
      onBlur={value ? onBlur : undefined}
      error={!!error}
      helperText={helperText || error}
      value={value === null? defaultValue || '' : value}
      onKeyDown={(e) => {
        if (e.key === 'Escape') cancel()
      }}
      InputProps={value !== null && cancel? {
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={cancel} size={'small'}>
            <RefreshIcon />
          </IconButton>
        </InputAdornment>,
      } : endAdornment?
        {
          endAdornment: <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>,
        } : undefined}
      {...newProps}
    />
  )
}

export function ValidatePhoneField(props) {
  const [errorIn, setErrorIn] = useState(false)
  const [helperTextIn, setHelperTextIn] = useState(null)
  const [exist, setExist] = useState(null)
  const {onChange, value, convertValue, defaultValue, onBlur, error, cancel, endAdornment, ...newProps} = props

  function handleChange(v) {
    Loader.clear()
    setExist(null)
    setErrorIn(null)
    v = reformat(v)
    if (convertValue) v = convertValue(v)
    if (v === defaultValue || v === '+7' || v === '7') v = null
    let valid = !helperTextIn
    if (isValid(v)) {
      setHelperTextIn(null)
      valid = true
      Loader.set(() => Fetch.get('signup', {phone: v}).then(r => {
        if (r.error) {
          setExist(r.error)
          setErrorIn(true)
        }
      }))
    }
    else if (!v) setHelperTextIn(null)
    if (onChange) onChange(v, props.name, valid)
  }

  const isValid = (v) => /^79[0-9]{9}$/.test(v)
  const reformat = (v) => [...v.matchAll(/[0-9]+/g)].join('')

  function onBlurIn() {
    let valid = isValid(value)
    if (valid) {
      setErrorIn(false)
      setHelperTextIn(null)
    }
    else {
      setErrorIn(true)
      setHelperTextIn("Неверный формат")
    }
    if (onBlur) onBlur(value, props.name, valid)
  }

  const helperText = "Для подтверждения используется Telegram"


  function getHelperText() {
    if (value || !defaultValue) {
      if (exist) return exist
      if (error) return error
      if (helperTextIn) return helperTextIn
      if (helperText) return helperText
    }
    return null
  }

  return (
    <MuiPhoneNumber
      disableDropdown
      color={'secondary'}
      countryCodeEditable={false}
      defaultCountry={'ru'}
      onlyCountries={['ru']}
      size="small"
      fullWidth
      autoComplete='off'
      onChange={handleChange}
      onBlur={value ? onBlurIn : undefined}
      error={!!error || errorIn}
      helperText={getHelperText()}
      value={value || defaultValue || ''}
      onKeyDown={(e) => {
        if (cancel && e.key === 'Escape') cancel(props.name)
      }}
      InputProps={!!value && !!cancel? {
        endAdornment: <InputAdornment position="end">
          <IconButton onClick={() => cancel(props.name)} size={'small'}>
            <RefreshIcon />
          </IconButton>
        </InputAdornment>,
      } : endAdornment? {
        endAdornment: <InputAdornment position="end">
          {endAdornment}
        </InputAdornment>,
      } : undefined}
      {...newProps}
    />)
}

export function ValidatePasswordField(props) {
  const [show, setShow] = useState(false)

  return (
    <ValidateTextField
      type={show? 'text' : 'password'}
      InputProps={{
      endAdornment:
        <InputAdornment position="end">
          <IconButton onClick={() => setShow(!show)} size={'small'}>
          {show ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      }}
      {...props}
    />)
}

export function ValidateUsernameField(props) {
  const [anchorEl, setAnchorEl] = useState(false)
  const [helperText, setHelperText] = useState("Минимум 4 символа")
  const [error, setError] = useState(false)

  const {onChange, ...newProps} = props

  const rules = [
    "Первый символ - только буква латинского алфавита",
    "Минимум 4 символа",
    "Используй только латиницу, цифры и нижнее подчеркивание"
  ]

  const defaultValue = props.defaultValue && !props.value

  function handleChange(v, name) {
    Loader.clear()
    if (v === null) {
      setHelperText(null)
      if (onChange) onChange(v, name, true)
      return
    }
    const value = v.toLowerCase()
    setError(false)
    let error = null
    if (value.match(/^[^a-z]/)) error = rules[0]
    if (!error && value.length < 4) error = rules[1]
    if (!error && value.match(/[^a-z0-9_]/)) error = rules[2]
    if (!error) {
      setHelperText(null)
      Loader.set(() => Fetch.get('signup', {username: value}).then(r => {
        setHelperText(r.error || null)
        setError(!!r.error)
      }))
    }
    else setHelperText(error)
    if (onChange) onChange(value, name, !error)
  }

  return (
    <>
      <ValidateTextField
        type={'username'}
        error={error}
        helperText={!defaultValue? helperText : undefined}
        onChange={handleChange}
        InputProps={!defaultValue ? {
          endAdornment:
            <InputAdornment position={'end'}>
              <IconButton onClick={(e) => setAnchorEl(e.target)} size={'small'}>
                <InfoOutlined />
              </IconButton>
            </InputAdornment>
        } : undefined}
        {...newProps}
      />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <PopoverContent style={{padding: 10}}>
          {rules.map((rule, i) => <Typography variant={'caption'} key={i}>{rule}<br/></Typography>)}
        </PopoverContent>
      </Popover>
    </>
  )
}

export function ValidateEmailField(props) {
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState(null)
  const {onChange, onBlur, ...newProps} = props

  function handleChange(v, name) {
    Loader.clear()
    setError(false)
    const valid = isValid(v)
    if (valid) {
      setHelperText(null)
      Loader.set(() => Fetch.get('signup', {email: v}).then(r => {
        setHelperText(r.error || null)
        setError(!!r.error)
      }))
    }
    if (onChange) onChange(v, name, valid)
  }

  const convertValue = (v) => v.toLowerCase()

  function onBlurIn() {
    const valid = isValid(props.value)
    if (valid) {
      setHelperText(null)
      setError(false)
    }
    else {
      setHelperText("Неверный формат")
      setError(true)
    }
    if (onBlur) onBlur(props.value, props.name, valid)
  }

  const isValid = (v) => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(v)

  return (
    <ValidateTextField
      type={'email'}
      error={error}
      helperText={helperText}
      convertValue={convertValue}
      onChange={handleChange}
      onBlur={onBlurIn}
      {...newProps}
    />
  )
}
