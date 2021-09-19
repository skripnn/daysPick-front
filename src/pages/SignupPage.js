import {useStyle} from "../js/core/auth";
import React, {useEffect, useState} from "react";
import Fetch from "../js/Fetch";
import Keys from "../js/Keys";
import Container from "@material-ui/core/Container";
import {
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListSubheader,
  Tooltip
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  ValidatePasswordField,
  ValidatePhoneField,
} from "../components/Fields/ValidateTextField/ValidateTextField";
import IconButton from "@material-ui/core/IconButton";
import {Telegram} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import TextField from "../components/Fields/TextField/TextField";
import UsernameEmailPhoneField from "../components/Fields/ValidateTextField/UsernameEmailPhoneField";
import {emailValidator} from "../js/functions/functions";
import Loader from "../js/Loader";

export default function SignupPage() {
  const classNames = useStyle()
  const [error, setError] = useState(null)
  const [password2error, setPassword2Error] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    main: null,
    password: null,
    password2: null,
  })
  const [valid, setValid] = useState({
    main: false,
    password2: false,
  })
  const [confirmType, setConfirmType] = useState('username')
  useEffect(() => setError(null), [data])

  function set(value, key, valid) {
    const obj = Object.fromEntries([[key, value]])
    setData(prevState => ({...prevState, ...obj}))
    if (valid !== undefined) {
      const val = Object.fromEntries([[key, valid]])
      setValid(prevState => ({...prevState, ...val}))
    }
  }

  function validation() {
    if (
      (confirmType === 'username' && !!data.main) ||
      (confirmType === 'phone' && !/^7[0-9]{10}$/.test(data.main)) ||
      (confirmType === 'email' && !emailValidator(data.main))
    ) {
      setValid(prevState => ({...prevState, main: 'Неверный формат'}))
      return false
    }
    return true
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!validation() || disabled) return
    setLoading(true)
    Fetch
      .post('signup', Object.fromEntries([
        [confirmType, data.main],
        ['password', data.password],
        ['password2', data.password2],
      ]))
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

  function mainFieldChange(value, type, error) {
    Loader.clear()
    set(value, 'main', error ? error : false)
    setConfirmType(type)
    let check = false
    if (type === 'phone' && /^7[0-9]{10}$/.test(value)) check = true
    else if (type === 'email'  && emailValidator(value)) check = true
    if (check) {
      Loader.set(() => Fetch.get('signup', Object.fromEntries([[type, value]])).then(r => {
        setValid(prevState => ({...prevState, main: r.error || true}))
      }))
    }
  }

  const TeleBotLink = `https://t.me/${Keys.telegramBot}?start=${data.username}`
  let helperText = typeof valid.main === 'string' && valid.main
  if (!helperText && confirmType === 'phone') helperText = 'Для подтверждения используется Telegram'
  const disabled = confirmType === 'username' || Object.values(data).includes(null) || valid.main !== true || valid.password2 !== true

  return (
    <Container maxWidth={'xs'}>
      <List>
        <form noValidate autoComplete={'off'}>
          <Typography variant={"h6"} color={'secondary'} align={'center'}>Регистрация</Typography>
            {!confirm &&
            <ListItem>
              <UsernameEmailPhoneField
                fieldProps={{
                  label: 'Email или телефон',
                  error: typeof valid.main === 'string',
                  helperText: helperText,
                  onBlur: validation,
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') onSubmit(e)
                  },
                }}
                onChange={mainFieldChange}
                validate={false}
              />
            </ListItem>
            }
            {confirmType === 'email' && confirm &&
            <ListItem>
              <TextField
                required
                label={'E-mail на подтверждении'}
                disabled
                value={data.main}
                helperText={'На этот e-mail было выслано письмо'}
              />
            </ListItem>
            }
            {confirmType === 'phone' && confirm &&
            <ListItem>
              <ValidatePhoneField
                label={'Телефон на подтверждении'}
                disabled
                value={data.main}
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
          </ListItem>
          }
          <ListItem>
            <ValidatePasswordField
              autoComplete={false}
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
            <Button
              disabled={disabled || loading}
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
