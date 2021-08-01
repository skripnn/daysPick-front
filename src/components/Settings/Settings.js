import {
  CircularProgress,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListSubheader,
  Snackbar,
  Tooltip
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Done, Mail, Save, Telegram} from "@material-ui/icons";
import ValidateTextField, {
  ValidatePasswordField,
  ValidatePhoneField
} from "../Fields/ValidateTextField/ValidateTextField";
import React, {useEffect, useState} from "react";
import Loader from "../../js/Loader";
import Fetch from "../../js/Fetch";
import CheckBoxField from "../Fields/CheckBoxField/CheckBoxField";
// import FacebookField from "../Fields/FacebookField/FacebookField";
import {inject, observer} from "mobx-react";
import Typography from "@material-ui/core/Typography";
import TextField from "../Fields/TextField/TextField";
import './Settings.css'
import Keys from "../../js/Keys";
import Info from "../../js/Info";


function Settings(props) {
  const {changeLocalUsername} = props
  const {
    username,
    setValue,
    is_public,
    email_confirm,
    email,
    phone,
    phone_confirm,
    is_confirmed
  } = props.store

  const [emailSend, setEmailSend] = useState(true)
  const TeleBotLink = `https://t.me/${Keys.telegramBot}?start=${localStorage.User}`

  const [v, setV] = useState({
    username: null,
    password: null,
    password2: null,
    email: null,
    phone: null
  })
  const [e, setE] = useState({
    username: null,
    password2: null,
    email: null,
    phone: null
  })

  useEffect(() => {
    setV(prevState => ({...prevState, password2: null}))
    setE(prevState => ({...prevState, password2: null}))
  }, [v.password])

  function password2Validation(value) {
    if (v.password2 !== value) {
      setE(prevState => ({...prevState, password2: 'Пароли не совпадают'}))
      return false
    }
    setE(prevState => ({...prevState, password2: null}))
    return true
  }

  function password2Change(value) {
    setV(prevState => ({...prevState, password2: value}))
    setE(prevState => ({...prevState, password2: null}))
  }

  function passwordChange(value) {
    setV(prevState => ({...prevState, password: value || null}))
  }

  function usernameChange(v) {
    const rules = [
      "Первый символ - только буква латинского алфавита",
      "Минимум 4 символа",
      "Используй только латиницу, цифры и нижнее подчеркивание"
    ]

    Loader.clear()
    if (v === null) {
      setE(prevState => ({...prevState, username: null}))
    } else {
      let error = null
      if (v.match(/^[^a-z]/)) error = rules[0]
      if (!error && v.length < 4) error = rules[1]
      if (!error && v.match(/[^a-z0-9_]/)) error = rules[2]
      setE(prevState => ({...prevState, username: error || true}))
      if (!error) {
        Loader.set(() => {
          Fetch.get('signup', {username: v})
            .then(r => setE(prevState => ({...prevState, username: r.error || null})))
        })
      }
    }
    setV(prevState => ({...prevState, username: v}))
  }

  function emailChange(v) {
    setV(prevState => ({...prevState, email: v || null}))
    setE(prevState => ({...prevState, email: null}))
  }

  function phoneChange(v) {
    setV(prevState => ({...prevState, phone: v || null}))
    setE(prevState => ({...prevState, phone: null}))
  }

  function emailBlur() {
    if (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(v.email)) setE(prevState => ({...prevState, email: null}))
    else setE(prevState => ({...prevState, email: "Неверный формат"}))
  }

  function phoneBlur() {
    if (/^79[0-9]{9}$/.test(v.phone)) setE(prevState => ({...prevState, phone: null}))
    else setE(prevState => ({...prevState, phone: "Неверный формат"}))
  }

  function cancel(name) {
    const obj = {}
    obj[name] = null
    setE(prevState => ({...prevState, ...obj}))
    setV(prevState => ({...prevState, ...obj}))
  }

  function delete_profile() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Удалить профиль?\nДанные невозможно будет восстановить')) {
      Fetch.delete(`@${localStorage.User}`).then((r) => {
        if (!r.error) {
          Info.info('Данные успешно удалены')
          localStorage.clear()
          Fetch.link('search')
        }
        else Info.info(r.error)
      })
    }
  }

  function SaveButton(props) {
    const {name, v, e, validator} = props
    if (v === null) return null


    function handleClick() {
      if (validator && !validator(v)) return
      const data = {}
      const obj = {}
      data[name] = v
      obj[name] = true
      setE(prevState => ({...prevState, ...obj}))
      Fetch.post('profile', data).then((r) => {
        if (name === 'username') changeLocalUsername(r)
        else setValue(r)
        cancel(name)
      })
    }

    return (<div style={{position: "relative", marginTop: 16, paddingLeft: 6}}>
        <IconButton size={'small'} onClick={handleClick} disabled={!!e}>
          <Save/>
          {e === true &&
          <CircularProgress style={{width: 30, height: 30, position: 'absolute', left: 0, top: 0}} color={"inherit"}/>}
        </IconButton>
      </div>
    )
  }

  console.log(v)
  console.log(e)

  return (
    <List dense>
      {is_confirmed ?
        <ListSubheader>Данные регистрации</ListSubheader> :
        <ListSubheader className={'text-red'}>Подтвердите аккаунт с помощью e-mail или номера телефона</ListSubheader>
      }
      <ListItem>
        <div className={'field-wrapper'}>
          <ValidateTextField
            label={'Имя пользователя'}
            name={'username'}
            convertValue={v => v.toLowerCase()}
            error={typeof e.username === 'string'}
            helperText={typeof e.username === 'string' ? e.username : undefined}
            value={v.username}
            defaultValue={username}
            onChange={usernameChange}
            cancel={() => cancel('username')}
          />
          <SaveButton name={'username'} v={v.username} e={e.username}/>
        </div>
      </ListItem>
      <ListItem>
        <div style={{width: "100%", display: 'flex', alignItems: 'flex-start', height: 46}}>
          <ValidatePasswordField
            autoComplete="new-password"
            label={'Новый пароль'}
            name={'new-password'}
            value={v.password}
            onChange={passwordChange}
            error={!!e.password2}
          />
          <SaveButton name={'password'} v={v.password} e={!v.password2 ? 'error' : e.password2}
                      validator={password2Validation}/>
        </div>
      </ListItem>
      {!!v.password && <ListItem>
        <ValidatePasswordField
          label={'Повтори новый пароль'}
          name={'password2'}
          value={v.password2}
          onChange={password2Change}
          error={e.password2}
        />
      </ListItem>}
      <ListItem>
        <Grid container spacing={1}>
          <Grid item xs={12} sm>
            <div className={'field-wrapper'}>
              <ValidateTextField
                label={'E-mail'}
                name={'email'}
                value={v.email}
                error={e.email}
                defaultValue={email_confirm}
                convertValue={value => value.toLowerCase()}
                onChange={emailChange}
                onBlur={emailBlur}
                cancel={() => cancel('email')}
                endAdornment={email_confirm ? <Done/> : undefined}
              />
              <SaveButton name={'email'} v={v.email} e={e.email}/>
            </div>
          </Grid>
          {!!email && <Grid item xs={12} sm>
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
                          onClick={() => Fetch.post('profile', {email: email}).then(() => setEmailSend(false))}
                          size={'small'}
                          disabled={emailSend !== true}
                        >
                          <Mail/>
                        </IconButton>
                      </InputAdornment>
                    </Tooltip>
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      open={emailSend === false}
                      onClose={() => setEmailSend(null)}
                      autoHideDuration={5000}
                      message="Письмо отправлено"
                    />
                  </>
              }}
            /> </Grid>}
        </Grid>
      </ListItem>

      <ListItem>
        <Grid container spacing={1}>
          <Grid item xs={12} sm>
            <div className={'field-wrapper'}>
              <ValidatePhoneField
                label={'Телефон'}
                name={'phone'}
                value={v.phone}
                error={e.phone}
                defaultValue={phone_confirm}
                onChange={phoneChange}
                onBlur={phoneBlur}
                cancel={cancel}
                endAdornment={phone_confirm ? <Done/> : undefined}
              />
              <SaveButton name={'phone'} v={v.phone} e={e.phone}/>
            </div>
          </Grid>
          {!!phone && <Grid item xs={12} sm>
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
            /> </Grid>}
        </Grid>
      </ListItem>
      {/*<ListItem>*/}
      {/*  <FacebookField value={facebook_account} set={setValue}/>*/}
      {/*</ListItem>*/}
      <ListItem>
        <Grid container spacing={1}>
          <Grid item xs={12} sm>
            <CheckBoxField
              name={'is_public'}
              label={'Публичный профиль'}
              checked={is_public}
              onChange={v => Fetch.post('profile', {is_public: v}).then(setValue)}
              disabled={!is_confirmed}
              helperText={!is_confirmed ? 'Необходимо подтвердить аккаунт' : undefined}
            />
          </Grid>
          <Grid item xs={12} sm>
            <div className={'delete-account-button'}>
            <Typography variant={'subtitle2'} color={'secondary'} onClick={delete_profile}
                        className={'delete-profile-button'}>Удалить профиль</Typography>
            </div>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  )
}

export default inject(stores => ({
  store: stores.UsersStore.getLocalUser().user,
  changeLocalUsername: stores.UsersStore.changeLocalUsername
}))(observer(Settings))
