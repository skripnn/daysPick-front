import {useStyle} from "../../js/core/auth";
import React, {useEffect, useState} from "react";
import Fetch from "../../js/Fetch";
import mainStore from "../../stores/mainStore";
import Container from "@material-ui/core/Container";
import {CircularProgress, List, ListItem, ListSubheader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {ValidatePasswordField} from "../Fields/ValidateTextField/ValidateTextField";
import Button from "@material-ui/core/Button";
import SocialLogin from "../SocialLogin/SocialLogin";
import UsernameEmailPhoneField from "../Fields/ValidateTextField/UsernameEmailPhoneField";

export default function Login({onSuccess}) {
  const classNames = useStyle()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    username: null,
    password: null
  })
  useEffect(() => setError(null), [data])
  useEffect(() => {
    if (localStorage.Authorization && localStorage.User) Fetch.autoLink(`@${localStorage.User}`)
  }, [])

  function onSubmit(e) {
    e.preventDefault()
    if (Object.values(data).includes(null)) setError('Заполни все поля')
    else {
      setLoading(true)
      Fetch.post('login', data)
        .then(r => {
            if (r.token) {
              if (error) setError(null)
              localStorage.setItem("Authorization", `Token ${r.token}`)
              localStorage.setItem("User", r.account.username)
              mainStore.AccountStore.setValue(r.account)
              if (onSuccess) onSuccess()
              else Fetch.autoLink(`@${localStorage.User}`)
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
    <Container maxWidth={'xs'}>
      <List>
        <form noValidate>
          <Typography variant={"h6"} color={'secondary'} align={'center'}>Авторизация</Typography>
          <ListItem>
            <UsernameEmailPhoneField
              onChange={(value, type, error) => {
                const newData = {password: data.password}
                if (!error) newData[type] = value
                else newData.username = null
                setData(newData)
              }}
              validate={false}
            />
          </ListItem>
          <ListItem>
            <ValidatePasswordField
              required
              label={'Пароль'}
              name={'password'}
              value={data.password}
              onChange={(v) => setData({...data, password: v})}
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
              onClick={() => Fetch.link('signup')}
            >
              Регистрация
            </Button>
          </ListItem>
          <ListItem>
            <SocialLogin />
          </ListItem>
          {!!error && <ListSubheader className={classNames.error}>{error}</ListSubheader>}
          <ListItem dense>
            <Button
              className={'colored-button'}
              style={{zoom: 0.8}}
              variant={"text"}
              color={'secondary'}
              size={"small"}
              fullWidth
              onClick={() => Fetch.autoLink('recovery')}
            >
              Восстановление доступа
            </Button>
          </ListItem>
        </form>
      </List>
    </Container>
  )
}
