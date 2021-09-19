import {
  EmailChangeField,
  NewPasswordField,
  NewUsernameField,
  PhoneChangeField
} from "../components/Settings/Settings";
import Fetch from "../js/Fetch";
import {inject, observer} from "mobx-react";
import Info from "../js/Info";
import {Grid, List, ListItem, ListSubheader} from "@material-ui/core";
import CheckBoxField from "../components/Fields/CheckBoxField/CheckBoxField";
import Typography from "@material-ui/core/Typography";
import React from "react";

function SettingsPage({Account:store}) {
  const {
    username,
    setValue,
    is_public,
    email_confirm,
    email,
    phone,
    phone_confirm,
    is_confirmed,
    logOut
  } = store

  if (!username) return null

  function delete_profile() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Удалить профиль?\nДанные невозможно будет восстановить')) {
      Fetch.delete('account').then((r) => {
        if (!r.error) {
          Info.success('Данные успешно удалены')
          logOut()
          Fetch.link('search')
        }
        else Info.error(r.error)
      })
    }
  }

  return (
    <List dense>
      {!is_confirmed &&
      <ListSubheader className={'text-red'}>Подтвердите аккаунт с помощью e-mail или номера телефона</ListSubheader>
      }
      <NewUsernameField username={username} setValue={setValue}/>
      <NewPasswordField/>
      <EmailChangeField email={email} email_confirm={email_confirm} setValue={setValue}/>
      <PhoneChangeField phone={phone} phone_confirm={phone_confirm} setValue={setValue}/>
      <ListItem>
        <Grid container spacing={1}>
          <Grid item xs={12} sm>
            <div onClick={!is_confirmed ? () => Info.error('Необходимо подтвердить аккаунт') : undefined}>
              <CheckBoxField
                name={'is_public'}
                label={'Публичный профиль'}
                checked={is_public}
                onChange={v => Fetch.post('account', {is_public: v}).then(setValue)}
                disabled={!is_confirmed}
                helperText={'Доступен через поиск'}
              />
            </div>
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

export default inject('Account')(observer(SettingsPage))
