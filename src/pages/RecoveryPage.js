import Container from "@material-ui/core/Container";
import {CircularProgress, List, ListItem, ListSubheader} from "@material-ui/core";
import ValidateTextField from "../components/Fields/ValidateTextField/ValidateTextField";
import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {useStyle} from "../js/core/auth";
import {emailValidator} from "../js/functions/functions";
import IconButton from "@material-ui/core/IconButton";
import MuiPhoneNumber from "material-ui-phone-number";
import Fetch from "../js/Fetch";
import {Email, Telegram} from "@material-ui/icons";
import Keys from "../js/Keys";
import {useLocation} from "react-router-dom";
import EmailLinkPage from "./EmailLinkPage";

export default function RecoveryPage() {
  const classNames = useStyle()
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const [type, setType] = useState('username')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [choice, setChoice] = useState(null)

  useEffect(() => {
    if (!value) setType('username')
    if (/^(\+7|7|8) ?\(?9/.test(value) || /^9/.test(value)) {
      setType('phone')
      if (value === '89' || value === '9') setValue('79')
    }
    else if (/^([\w.%+-]+)@/.test(value)) setType('email')
    else setType('username')
    setError(null)
  }, [value])

  const location = useLocation()
  if (location.search) return <EmailLinkPage />

  function onSubmit(chosen) {
    if (value && !error) {
      if (type === 'phone' && !/^7[0-9]{10}$/.test(value)) setError('Неверный формат')
      else if (type === 'email' && !emailValidator(value)) setError('Неверный формат')
      else {
        const chosenType = (typeof chosen === 'string' ? chosen : null)
        setLoading(chosenType ? chosenType : true)
        const data = {type: type, value: value}
        if (chosenType) {
          data.chosen = chosenType
        }
        Fetch.post('recovery', data).then((r) => {
          if (r.error) setError(r.error)
          else {
            setResult(r.message)
            if (r.choice) setChoice(true)
            else setChoice(false)
          }
          setLoading(false)
        })
      }
    }
  }

  const fieldProps = {
    disabled: !!loading || !!result,
    autoFocus: true,
    required: true,
    value: value,
    onChange: setValue,
    error: !!error,
    helperText: error || 'Введи имя пользователя, email или телефон в международном формате',
    onKeyDown: (e) => {
      if (e.key === 'Escape') setValue('')
      if (e.key === 'Enter') onSubmit()
    }
  }

  let message = null
  if (result === 'telegram') {
    const TeleBotLink = `https://t.me/${Keys.telegramBot}?start=_recovery`
    message = <>Перейди в telegram-бот <a href={TeleBotLink} target={'_blank'} rel={"noreferrer"}>@dayspick_bot</a></>
  }

  return (
    <Container maxWidth={'xs'}>
      <List>
        <ListItem>
          {type === 'username' &&
            <ValidateTextField
              {...fieldProps}
              label={'Имя пользователя, email или телефон'}
              name={'username'}
              convertValue={v => (v ? v.toLowerCase() : v)}
            />
          }
          {type === 'email' &&
          <ValidateTextField
            {...fieldProps}
            label={'Email'}
            name={'email'}
            convertValue={v => (v ? v.toLowerCase() : v)}
          />
          }
          {type === 'phone' &&
          <MuiPhoneNumber
            {...fieldProps}
            label={'Телефон'}
            name={'phone'}
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
        </ListItem>
        {!result &&
          <ListItem>
            <Button
              disabled={!value || !!error || !!loading || !!result}
              variant={'outlined'}
              type={'submit'}
              className={classNames.button}
              fullWidth
              onClick={onSubmit}
            >
              {!!loading ? <CircularProgress color={'secondary'} size={24} style={{opacity: 0.5}}/> : 'Восстановить доступ'}
            </Button>
          </ListItem>
        }
        {!!result && !choice &&
          <ListSubheader style={{lineHeight: "unset", textAlign: 'center'}}>{message || result}</ListSubheader>
        }
        {!!choice &&
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <ListSubheader style={{lineHeight: "unset"}}>{result}</ListSubheader>
            <div style={{display: 'flex', paddingRight: 16}}>
              <IconButton size={'small'} className={'colored-button'} onClick={() => onSubmit('phone')}>
                {loading === 'phone' ? <CircularProgress color={'inherit'} size={24}/> : <Telegram/>}
              </IconButton>
              <IconButton size={'small'} className={'colored-button'} onClick={() => onSubmit('email')}>
                {loading === 'email' ? <CircularProgress color={'inherit'} size={24}/> : <Email/>}
              </IconButton>
            </div>
          </div>
        }
      </List>
    </Container>
  )
}
