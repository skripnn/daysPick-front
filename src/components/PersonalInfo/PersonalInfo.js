import React, {useState} from "react";
import {
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListSubheader, Snackbar,
  Tooltip
} from "@material-ui/core";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "../Icons/RefreshIcon";
import {Mail, Save, Telegram} from "@material-ui/icons";
import ValidateTextField, {ValidatePhoneField} from "../Fields/ValidateTextField/ValidateTextField";
import TextField from "../Fields/TextField/TextField";
import Fetch from "../../js/Fetch";

function PersonalInfo(props) {
  const {first_name, last_name, email, email_confirm, phone, phone_confirm, setValue} = props
  const [emailSend, setEmailSend] = useState(true)
  const TeleBotLink = `https://t.me/dayspick_bot?start=${localStorage.User}`
  console.log(props)

  const [v, setV] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone: null
  })
  const [e, setE] = useState({
    first_name: null,
    last_name: null,
    email: null,
    phone: null
  })

  const notNull = (state) => Object.values(state).filter(value => value !== null).length

  function save() {
    let dict = {}
    for (const [key, value] of Object.entries(v)) if (value) dict[key] = value
    Fetch.post('profile', dict).then(r => {
      setValue(r)
      cancel()
    })
  }

  function handleChange(value, prop) {
    const obj = Object.fromEntries([[prop, value]])
    setV({...v, ...obj})
    for (const key of Object.keys(obj)) {
      const dict = Object.fromEntries([[key, null]])
      setE({...e, ...dict})
    }
  }

  function emailBlur() {
    console.log('emailBlur')
    if (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(v.email)) setE({...e, email: null})
    else setE({...e, email: "Неверный формат"})
  }

  function phoneBlur() {
    if (/^\+\d \(([0-9]{3})\) ([0-9]{3})-([0-9]{2})-([0-9]{2})$/.test(v.phone)) setE({...e, phone: null})
    else setE({...e, phone: "Неверный формат"})
  }

  function cancel(key) {
    let dict
    if (!key) dict = Object.fromEntries(Object.keys(v).map(key => [key, null]))
    else dict = Object.fromEntries([[key, null]])
    setV({...v, ...dict})
    setE({...e, ...dict})
  }

  return (
    <List dense>
      <ListSubheader>
        <ActionsPanel
          left={'Личная информация'}
          right={notNull(v) ? <>
            {notNull(v) > 1 && <IconButton onClick={() => cancel()} children={<RefreshIcon/>}/>}
            <IconButton disabled={!!notNull(e)} onClick={save} children={<Save />} />
          </> : undefined}
        />
      </ListSubheader>
      <ListItem>
        <ValidateTextField
          label={'Имя'}
          name={'first_name'}
          value={v.first_name}
          defaultValue={first_name}
          onChange={handleChange}
          cancel={() => cancel('first_name')}
        />
      </ListItem>
      <ListItem>
        <ValidateTextField
          label={'Фамилия'}
          name={'last_name'}
          value={v.last_name}
          defaultValue={last_name}
          onChange={handleChange}
          cancel={() => cancel('last_name')}
        />
      </ListItem>
      <ListItem>
      <Grid container spacing={1}>
        <Grid item xs={12} sm>
          <ValidateTextField
            label={'E-mail'}
            name={'email'}
            value={v.email}
            error={e.email}
            defaultValue={email_confirm}
            convertValue={value => value.toLowerCase()}
            onChange={handleChange}
            onBlur={emailBlur}
            cancel={() => cancel('email')}
          />
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
                    <Mail />
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
            <ValidatePhoneField
              label={'Телефон'}
              name={'phone'}
              value={v.phone}
              error={e.phone}
              defaultValue={phone_confirm}
              onChange={handleChange}
              onBlur={phoneBlur}
              cancel={cancel}
            />
          </Grid>
          {!!phone && <Grid item xs={12} sm>
            <TextField
              label={'Телефон на подтверждении'}
              disabled
              value={phone}
              helperText={<>Перейди в telegram-бот <a href={TeleBotLink} target={'_blank'} rel={"noreferrer"}>@dayspick_bot</a></>}
              InputProps={{
                endAdornment:
                  <Tooltip title="@dayspick_bot">
                    <InputAdornment position="end">
                      <IconButton onClick={() => window.open(TeleBotLink)} size={'small'}>
                        <Telegram />
                      </IconButton>
                    </InputAdornment>
                  </Tooltip>
              }}
            /> </Grid>}
        </Grid>
      </ListItem>
    </List>
  )
}

export default PersonalInfo