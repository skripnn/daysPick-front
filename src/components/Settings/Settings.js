import {CircularProgress, FormControl, FormHelperText, List, ListItem} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Save} from "@material-ui/icons";
import ValidateTextField, {ValidatePasswordField} from "../Fields/ValidateTextField/ValidateTextField";
import React, {useEffect, useState} from "react";
import Loader from "../../js/Loader";
import Fetch from "../../js/Fetch";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";


function Settings(props) {
  const {changeLocalUsername, username, setValue, is_public, is_public_disabled} = props

  const [v, setV] = useState({
    username: null,
    password: null,
    password2: null
  })
  const [e, setE] = useState({
    username: null,
    password2: null
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
    }
    else {
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

  function cancel(name) {
    const obj = {}
    obj[name] = null
    setE(prevState => ({...prevState, ...obj}))
    setV(prevState => ({...prevState, ...obj}))
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
        <Save />
        {e === true && <CircularProgress style={{width: 30, height: 30, position: 'absolute', left: 0, top: 0}} color={"inherit"}/>}
      </IconButton>
    </div>
    )
  }

  const isPublicCheckBox = <Checkbox
    color={"default"}
    checked={is_public}
    onChange={e => Fetch.post('profile', {is_public: e.target.checked}).then(setValue)}
  />

  return (
    <List dense>
      <ListItem>
        <div style={{width: "100%", display: 'flex', alignItems: 'flex-start', height: 46}}>
          <ValidateTextField
          label={'Имя пользователя'}
          name={'username'}
          convertValue={v => v.toLowerCase()}
          error={typeof e.username === 'string'}
          helperText={typeof e.username === 'string'? e.username : undefined}
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
          label={'Новый пароль'}
          name={'password'}
          value={v.password}
          onChange={passwordChange}
          error={!!e.password2}
        />
          <SaveButton name={'password'} v={v.password} e={!v.password2? 'error' : e.password2} validator={password2Validation}/>
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
        <FormControl>
          <FormControlLabel
            labelPlacement="end"
            name='is_public'
            label={<Typography color={"textPrimary"}>Публичный профиль (доступен через поиск)</Typography>}
            control={isPublicCheckBox}
            disabled={is_public_disabled}

          />
          {is_public_disabled && <FormHelperText style={{marginTop: -9}}>Необходимо подтвердить номер телефона</FormHelperText>}
        </FormControl>
      </ListItem>
    </List>

  )
}

export default Settings