import {
  Grid,
  InputAdornment,
  ListItem,
  Tooltip
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Cancel, Done, Mail, Telegram} from "@material-ui/icons";
import ValidateTextField, {
  ValidateEmailField,
  ValidatePasswordField,
  ValidatePhoneField
} from "../Fields/ValidateTextField/ValidateTextField";
import React, {useEffect, useState} from "react";
import Loader from "../../js/Loader";
import Fetch from "../../js/Fetch";
import TextField from "../Fields/TextField/TextField";
import './Settings.css'
import Keys from "../../js/Keys";
import Info from "../../js/Info";
import {SaveFieldButton} from "../Fields/SaveTextField/SaveTextField";
import {useControlledState, useMobile} from "../hooks";
import RefreshIcon from "../Icons/RefreshIcon";
import MuiPhoneNumber from "material-ui-phone-number";
import {useAccount} from "../../stores/storeHooks";


export function NewUsernameField({username, setValue}) {
  const [newUsername, setNewUsername] = useState(username)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line
  useEffect(onChange, [newUsername])

  function validation(v) {
    const rules = [
      "Поле не может быть пустым",
      "Первый символ - только буква латинского алфавита",
      "Минимум 4 символа",
      "Используй только латиницу, цифры и нижнее подчеркивание"
    ]

    if (!v) return rules[0]
    if (v.match(/^[^a-z]/)) return rules[1]
    if (v.length < 4) return rules[2]
    if (v.match(/[^a-z0-9_]/)) return rules[3]
    return null
  }

  function onChange() {
    if (newUsername === username) {
      setError(null)
      setLoading(false)
    }
    else {
      const error = validation(newUsername)
      setError(error)
      if (!error) {
        setLoading(true)
        Fetch.get('signup', {username: newUsername}).then(r => {
          if (r.error) setError(r.error)
          setLoading(false)
        })
      }
    }
  }

  function onSave() {
    if (error) return
    setLoading(true)
    Fetch.post('account', {username: newUsername})
      .then(r => {
        if (r.error) setError(r.error)
        else {
          setValue(r)
          setError(null)
        }
        setLoading(false)
      })
  }

  const refreshButton = username !== newUsername ? (
    <InputAdornment position="end">
      <IconButton onClick={() => setNewUsername(username)} size={'small'}>
        <RefreshIcon />
      </IconButton>
    </InputAdornment>
  ) : undefined

  return (
    <ListItem>
      <div className={'field-wrapper'}>
        <ValidateTextField
          required
          label={'Имя пользователя'}
          name={'username'}
          convertValue={v => v.toLowerCase()}
          onChange={setNewUsername}
          error={error}
          value={newUsername}
          InputProps={{
            endAdornment: refreshButton
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') setNewUsername(username)
            if (e.key === 'Enter' && !error) onSave()
          }}
        />
        {newUsername !== username && <SaveFieldButton onClick={onSave} disabled={!!error} loading={loading}/> }
      </div>
    </ListItem>
  )
}

export function NewPasswordField() {
  const [password, setPassword] = useState(null)
  const [password2, setPassword2] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const mobile = useMobile()

  useEffect(() => {
    if (!password) {
      setPassword2(null)
      setError(null)
    }
  // eslint-disable-next-line
  }, [password])

  useEffect(() => {
    if (password2) {
      if (password2 !== password) setError(true)
      else setError(false)
    }
    else setError(false)
  }, [password, password2])

  function onSave() {
    setLoading(true)
    Fetch.post('account', {password: password}).then(r => {
      setPassword(null)
      setPassword2(null)
      setError(false)
      setLoading(false)
      r.error ? Info.error(r.error) : Info.success('Пароль обновлен')
      if (r.token) localStorage.setItem("Authorization", `Token ${r.token}`)
    })
  }

  return (
    <ListItem>
      <Grid container spacing={1}>
        <Grid item xs={12} sm>
          <div className={'field-wrapper'}>
          <ValidatePasswordField
            autoComplete="new-password"
            label={'Новый пароль'}
            name={'new-password'}
            value={password}
            onChange={v => setPassword(v || null)}
            error={error}
            disabled={loading}
          />
          {!!password && mobile && <SaveFieldButton onClick={onSave} disabled={error || !password2} loading={loading}/>}
          </div>
        </Grid>
          {!!password &&
          <Grid item xs={12} sm>
            <div className={'field-wrapper'}>
            <ValidatePasswordField
              label={'Повтори новый пароль'}
              name={'password2'}
              value={password2}
              onChange={v => setPassword2(v || null)}
              error={error ? 'Пароли не совпадают' : null}
              disabled={loading}
            />
            {!!password && !mobile && <SaveFieldButton onClick={onSave} disabled={error || !password2} loading={loading}/>}
            </div>
          </Grid>
          }
      </Grid>
    </ListItem>
  )
}

export function EmailChangeField({email, email_confirm, setValue}) {

  const [newEmail, setNewEmail] = useState(email_confirm)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emailSend, setEmailSend] = useState(true)

  function onSave() {
    Fetch.post('account', {email: newEmail})
      .then(r => {
        if (r.error) setError(r.error)
        else {
          setValue(r)
          reset()
        }
      })
  }

  function cancel() {
    Fetch.post('account', {email: null}).then(setValue).then(() => setEmailSend(true))
  }

  function reset() {
    setNewEmail(email_confirm)
    setError(null)
    setLoading(false)
  }

  function onChange2(value, name, valid) {
    Loader.clear()
    setLoading(false)
    setNewEmail(value || null)
    if (!value) setError('Поле не может быть пустым')
    else {
      if (!valid) setError('Неверный формат')
      else {
        setError(null)
        if (value !== email_confirm) {
          setLoading(true)
          setError(null)
          Loader.set(() => Fetch.get('signup', {email: value})
            .then(r => {
              setError(r.error || null)
              setLoading(false)
            }))
        }
      }
    }
  }

  const refreshButton = email_confirm ? (
    <InputAdornment position="end">
      <IconButton onClick={reset} size={'small'}>
        <RefreshIcon />
      </IconButton>
    </InputAdornment>
  ) : undefined

  return (
    <ListItem>
      <Grid container spacing={1}>
        <Grid item xs={12} sm>
          <div className={'field-wrapper'}>
            <ValidateEmailField
              required={!!email_confirm}
              label={'E-mail'}
              name={'email'}
              onChange={onChange2}
              value={newEmail}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: newEmail && newEmail === email_confirm ? <Done/> : refreshButton
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') reset()
                if (e.key === 'Enter' && !error) onSave()
              }}
            />
            {newEmail !== email_confirm && <SaveFieldButton onClick={onSave} disabled={!!error} loading={loading}/> }
          </div>
        </Grid>
        {!!email && <Grid item xs={12} sm>
          <div className={'field-wrapper'}>
            <TextField
              label={'E-mail на подтверждении'}
              disabled
              value={email}
              helperText={'На этот e-mail было выслано письмо'}
              InputProps={{
                endAdornment:
                  <>
                    <Tooltip title="Повторить отправку письма">
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => Fetch.post('account', {email: email})
                            .then(() => {
                              setEmailSend(false)
                              Info.info('Письмо отправлено')
                            })
                          }
                          size={'small'}
                          disabled={!emailSend}
                        >
                          <Mail/>
                        </IconButton>
                      </InputAdornment>
                    </Tooltip>
                  </>
              }}
            />
            <div className={'save-text-field-button-wrapper'}>
              <IconButton size={'small'} onClick={cancel}>
                <Cancel/>
              </IconButton>
            </div>
          </div>
        </Grid>}
      </Grid>
    </ListItem>
  )
}

export function PhoneChangeField({phone, phone_confirm, setValue}) {

  const [newPhone, setNewPhone] = useControlledState(phone_confirm)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const {username} = useAccount()

  const TeleBotLink = `https://t.me/${Keys.telegramBot}?start=${username}`
  const isValid = (v) => /^79[0-9]{9}$/.test(v)

  // eslint-disable-next-line
  useEffect(onChange, [newPhone])

  function onChange() {
    if (newPhone === phone_confirm) {
      setError(null)
      setLoading(false)
    }
    else if (!newPhone) setError('Поле не может быть пустым')
    else if (!isValid(newPhone)) setError('Неверный формат')
    else {
      setError(null)
      setLoading(true)
      Fetch.get('signup', {phone: newPhone}).then(r => {
        if (r.error) setError(r.error)
        setLoading(false)
      })
    }
  }

  function cancel() {
    Fetch.post('account', {phone: null}).then(setValue)
  }

  function onSave() {
    if (error) return
    setLoading(true)
    Fetch.post('account', {phone: newPhone})
      .then(r => {
        if (r.error) setError(r.error)
        else {
          setValue(r)
          setError(null)
          setNewPhone(phone_confirm)
        }
        setLoading(false)
      })
  }

  const refreshButton = phone_confirm ? (
    <InputAdornment position="end">
      <IconButton onClick={() => setNewPhone(phone_confirm)} size={'small'}>
        <RefreshIcon />
      </IconButton>
    </InputAdornment>
  ) : undefined


  return (
    <ListItem>
      <Grid container spacing={1}>
        <Grid item xs={12} sm>
          <div className={'field-wrapper'}>
            <MuiPhoneNumber
              required={!!phone_confirm}
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
              onChange={v => setNewPhone(v === '+7' ? null : [...v.matchAll(/[0-9]+/g)].join(''))}
              error={!!error}
              helperText={error}
              value={newPhone ? newPhone : ''}
              InputProps={{
                endAdornment: newPhone && newPhone === phone_confirm ? <Done/> : refreshButton
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') setNewPhone(phone_confirm)
                if (e.key === 'Enter' && !error) onSave()
              }}
            />
            {newPhone !== phone_confirm && <SaveFieldButton onClick={onSave} disabled={!!error} loading={loading}/>}
          </div>
        </Grid>
        {!!phone && <Grid item xs={12} sm>
          <div className={'field-wrapper'}>
            <ValidatePhoneField
              label={'Телефон на подтверждении'}
              disabled
              value={phone}
              helperText={<>Перейди в telegram-бот <a href={TeleBotLink} target={'_blank'}
                                                      rel={"noreferrer"}>@dayspick_bot</a></>}
              InputProps={{
                endAdornment:
                  <Tooltip title="@dayspick_bot">
                    <InputAdornment position="end">
                      <IconButton onClick={() => window.open(TeleBotLink)} size={'small'}>
                        <Telegram/>
                      </IconButton>
                    </InputAdornment>
                  </Tooltip>
              }}
            />
            <div className={'save-text-field-button-wrapper'}>
              <IconButton size={'small'} onClick={cancel}>
                <Cancel/>
              </IconButton>
            </div>
          </div>
        </Grid>}
      </Grid>
    </ListItem>
  )
}
