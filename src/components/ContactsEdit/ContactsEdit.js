import Fetch from "../../js/Fetch";
import SaveTextField from "../Fields/SaveTextField/SaveTextField";
import {inject, observer} from "mobx-react";
import React from "react";
import {List, ListSubheader} from "@material-ui/core";

function ContactsEdit({contacts}) {
  const {email, phone, telegram, setValue} = contacts

  function emailValidator(value) {
    return /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(value)
  }

  function phoneValidator(value) {
    return /^\+7 \(9[0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)
  }

  function onSave(data) {
    Fetch.post(['profile', 'contacts'], data).then(setValue)
  }

  return (
    <List dense>
      <ListSubheader disableSticky>Контакты</ListSubheader>
      <SaveTextField
        label={'E-mail'}
        name={'email'}
        convertValue={value => value.toLowerCase()}
        validator={emailValidator}
        onSave={onSave}
        defaultValue={email}
      />
      <SaveTextField
        label={'Телефон'}
        name={'phone'}
        onSave={onSave}
        defaultValue={phone}
        validator={phoneValidator}
      />
      <SaveTextField
        label={'Telegram'}
        name={'telegram'}
        onSave={onSave}
        defaultValue={telegram}
      />
    </List>
  )
}

export default inject(stores => ({
  contacts: stores.UsersStore.getLocalUser().user.contacts
}))(observer(ContactsEdit))
