import React, {useEffect, useState} from "react";
import {emailValidator} from "../../../js/functions/functions";
import ValidateTextField from "./ValidateTextField";
import MuiPhoneNumber from "material-ui-phone-number";

export default function UsernameEmailPhoneField({fieldProps={}, onChange=() => {}, validate=true, disableAutoFill}) {
  const [value, setValue] = useState('')
  const [type, setType] = useState('username')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!value) setType('username')
    if (/^(\+7|7|8) ?\(?9/.test(value) || /^9/.test(value)) {
      setType('phone')
      if (/^(\+7|7|8) ?\(?9$/.test(value) || /^9$/.test(value)) setValue('79')
      setValue([...value.matchAll(/[0-9]+/g)].join(''))
    }
    else if (/^([\w.%+-]+)@/.test(value)) setType('email')
    else setType('username')

    if (validate) {
      if (type === 'phone' && !/^7[0-9]{10}$/.test(value)) setError('Неверный формат')
      else if (type === 'email' && !emailValidator(value)) setError('Неверный формат')
      else setError(null)
    }

    onChange(value, type, error)
  //eslint-disable-next-line
  }, [value, type, error])

  const {helperText, onKeyDown, ...otherFieldProps} = fieldProps

  const fieldsProps = {
    autoFocus: true,
    required: true,
    value: value,
    onChange: setValue,
    error: !!error,
    helperText: error || helperText,
    onKeyDown: (e) => {
      if (e.key === 'Escape') setValue('')
      if (onKeyDown) onKeyDown(e)
    },
    ...otherFieldProps
  }

  return (
    <>
      {type === 'username' &&
      <ValidateTextField
        label={'Имя пользователя, email или телефон'}
        name={!disableAutoFill && 'username'}
        convertValue={v => (v ? v.toLowerCase() : v)}
        {...fieldsProps}
      />
      }
      {type === 'email' &&
      <ValidateTextField
        {...fieldsProps}
        label={'Email'}
        name={!disableAutoFill && 'email'}
        convertValue={v => (v ? v.toLowerCase() : v)}
      />
      }
      {type === 'phone' &&
      <MuiPhoneNumber
        {...fieldsProps}
        label={'Телефон'}
        name={!disableAutoFill && 'phone'}
        disableDropdown
        color={'secondary'}
        countryCodeEditable={false}
        defaultCountry={'ru'}
        onlyCountries={['ru']}
        size="small"
        fullWidth
        autoComplete='off'
        onChange={(v) => setValue([...v.matchAll(/[0-9]+/g)].join(''))}
      />
      }
    </>
  )
}
