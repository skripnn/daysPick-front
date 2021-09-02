import {useStyle} from "../js/core/auth";
import React, {useEffect, useState} from "react";
import Fetch from "../js/Fetch";
import Keys from "../js/Keys";
import Container from "@material-ui/core/Container";
import {
  CircularProgress,
  InputAdornment, InputLabel,
  List,
  ListItem,
  ListSubheader,
  Tooltip
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  ValidateEmailField,
  ValidatePasswordField,
  ValidatePhoneField,
  ValidateUsernameField
} from "../components/Fields/ValidateTextField/ValidateTextField";
import IconButton from "@material-ui/core/IconButton";
import {Email, Telegram} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import TextField from "../components/Fields/TextField/TextField";


export default function SignupPage() {
  const classNames = useStyle()
  const [error, setError] = useState(null)
  const [password2error, setPassword2Error] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    username: null,
    password: null,
    password2: null,
    // email: null,
    phone: null
  })
  const [valid, setValid] = useState({
    username: false,
    password2: false,
    // email: false,
    phone: false
  })
  useEffect(() => setError(null), [data])

  function set(value, key, valid) {
    const obj = Object.fromEntries([[key, value]])
    setData(prevState => ({...prevState, ...obj}))
    if (valid !== undefined) {
      const val = Object.fromEntries([[key, valid]])
      setValid(prevState => ({...prevState, ...val}))
    }
  }

  function changeConfirmType() {
    if (confirm) return
    const newData = {...data, phone: null, email: null}
    const newValid = {...valid, phone: false, email: false}
    delete newData[confirmType]
    delete newValid[confirmType]
    setData(newData)
    setValid(newValid)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (Object.values(data).includes(null) || Object.values(valid).includes(false)) return
    setLoading(true)
    Fetch.post('signup', data)
      .then(r => {
          if (r.error) {
            setLoading(false)
            setError(r.error)
          }
          else {
            if (error) setError(null)
            setConfirm(true)
          }
        }
      )
  }

  function password2Validation(value) {
    if (data.password2) {
      if (data.password2 !== (value)) {
        setPassword2Error('Пароли не совпадают')
        set(data.password2, 'password2', false)
      }
      else {
        setPassword2Error(null)
        set(data.password2, 'password2', true)
      }
    }
  }

  function password2Change(value, key) {
    setPassword2Error(null)
    set(value, key, true)
  }

  function passwordChange(value, key) {
    set(value, key, true)
    password2Validation(value)
  }

  const TeleBotLink = `https://t.me/${Keys.telegramBot}?start=${data.username}`
  const confirmType = Object.keys(data).includes('email') ? 'email' : 'phone'

  return (
    <Container maxWidth={'xs'}>
      <List>
        <form noValidate>
          <Typography variant={"h6"} color={'secondary'} align={'center'}>Регистрация</Typography>
          <ListItem>
            <ValidateUsernameField
              disabled={confirm}
              autoFocus
              required
              label={'Имя пользователя'}
              name={'username'}
              value={data.username}
              onChange={set}
            />
          </ListItem>
          <ListItem>
            <ValidatePasswordField
              disabled={confirm}
              required
              label={'Пароль'}
              name={'password'}
              value={data.password}
              onChange={passwordChange}
            />
          </ListItem>
          <ListItem>
            <ValidatePasswordField
              disabled={confirm}
              required
              label={'Повтори пароль'}
              name={'password2'}
              value={data.password2}
              onChange={password2Change}
              onBlur={() => password2Validation(data.password)}
              error={password2error}
            />
          </ListItem>
          <ListItem>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 8}}>
              <InputLabel onClick={changeConfirmType} style={confirm ? undefined : {cursor: 'pointer'}}>Способ подтверждения аккаунта:</InputLabel>
              <div style={{display: 'flex'}}>
                <IconButton size={'small'} onClick={changeConfirmType} className={confirmType === 'phone' ? classNames.confirm : undefined}>
                  <Telegram />
                </IconButton>
                <IconButton size={'small'} onClick={changeConfirmType} className={confirmType === 'email' ? classNames.confirm : undefined}>
                  <Email/>
                </IconButton>
              </div>
            </div>
          </ListItem>
          {confirmType === 'email' &&
            <ListItem>
              {!confirm ?
                <ValidateEmailField
                  required
                  label={'E-mail'}
                  name={'email'}
                  value={data.email}
                  onChange={set}
                  onBlur={set}
                  helperText={'На этот e-mail будет выслано письмо'}
                /> :
                <TextField
                  required
                  label={'E-mail на подтверждении'}
                  disabled
                  value={data.email}
                  helperText={'На этот e-mail было выслано письмо'}
                />
              }
            </ListItem>
          }
          {confirmType === 'phone' &&
            <ListItem>
              {!confirm?
                <ValidatePhoneField
                  required
                  label={'Телефон'}
                  name={'phone'}
                  value={data.phone}
                  onChange={set}
                  onBlur={set}
                /> :
                <ValidatePhoneField
                  label={'Телефон на подтверждении'}
                  disabled
                  value={data.phone}
                  helperText={<>Перейди в telegram-бот <a href={TeleBotLink} target={'_blank'} rel={"noreferrer"}>@dayspick_bot</a></>}
                  InputProps={{
                    endAdornment:
                      <Tooltip title="@dayspick_bot">
                        <InputAdornment position="end">
                          <IconButton onClick={() => window.open(TeleBotLink)}>
                            <Telegram />
                          </IconButton>
                        </InputAdornment>
                      </Tooltip>
                  }}
                />
              }
            </ListItem>
          }
          <ListItem>
            <Button
              disabled={Object.values(data).includes(null) || Object.values(valid).includes(false) || loading}
              variant={'outlined'}
              type={'submit'}
              className={classNames.button}
              fullWidth
              onClick={onSubmit}
            >
              {loading && !confirm? <CircularProgress color={'secondary'} size={24} style={{opacity: 0.5}}/> : 'Зарегистрироваться'}
            </Button>
          </ListItem>
          {!!error && <ListSubheader className={classNames.error}>{error}</ListSubheader>}
          {confirm && confirmType === 'phone' && <ListSubheader className={classNames.confirm}><>Перейди в telegram-бот <a href={TeleBotLink} target={'_blank'} rel={"noreferrer"}>@dayspick_bot</a></></ListSubheader>}
          {confirm && confirmType === 'email' && <ListSubheader className={classNames.confirm}>Письмо для подтверждения аккаунта отправлено</ListSubheader>}
        </form>
      </List>
    </Container>
  )
}
