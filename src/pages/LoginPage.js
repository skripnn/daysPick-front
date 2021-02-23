import {CircularProgress, List, ListItem, ListSubheader} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import ValidateTextField, {ValidatePasswordField} from "../components/Fields/ValidateTextField/ValidateTextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {useStyle} from "../js/core/auth";
import {inject, observer} from "mobx-react";
import Fetch from "../js/Fetch";


function LoginPage(props) {
  const classNames = useStyle()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    username: null,
    password: null
  })
  useEffect(() => setError(null), [data])

  function set(value, key) {
    const obj = Object.fromEntries([[key, value]])
    setData(prevState => ({...prevState, ...obj}))
  }

  function onSubmit(e) {
    e.preventDefault()
    if (Object.values(data).includes(null)) setError('Заполни все поля')
    else {
      setLoading(true)
      Fetch.post('login', data)
        .then(r => {
            if (r.token) {
              if (error) setError(null)
              props.UsersStore.setLocalUser(r)
              props.history.push(`/user/${localStorage.User}/`)
            }
            else {
              setLoading(false)
              setError(r.error)
            }
          }
        )
    }
  }

  return (
    <Box className={classNames.root}>
      <Box flexGrow={1}/>
      <Container maxWidth={'xs'}>
        <List>
          <form noValidate>
          <Typography variant={"h6"} color={'secondary'} align={'center'}>Авторизация</Typography>
          <ListItem>
            <ValidateTextField
              autoFocus
              required
              type={'username'}
              label={'Имя пользователя'}
              name={'username'}
              value={data.username}
              convertValue={v => (v? v.toLowerCase() : v)}
              onChange={set}
            />
          </ListItem>
          <ListItem>
            <ValidatePasswordField
              required
              label={'Пароль'}
              name={'password'}
              value={data.password}
              onChange={set}
            />
          </ListItem>
          <ListItem>
            <Button
              disabled={Object.values(data).includes(null) || loading}
              variant={'outlined'}
              type={'submit'}
              className={classNames.button}
              fullWidth
              onClick={onSubmit}
            >
              {loading? <CircularProgress color={'secondary'} size={24}/> : "Войти"}
            </Button>
            <Button
              variant={'outlined'}
              color={'secondary'}
              fullWidth
              onClick={() => props.history.push('/signup/')}
            >
              Регистрация
            </Button>
          </ListItem>
          {!!error && <ListSubheader className={classNames.error}>{error}</ListSubheader>}
          </form>
        </List>
      </Container>
      <Box flexGrow={2}/>
    </Box>
  )
}

export default inject('UsersStore')(observer(LoginPage))