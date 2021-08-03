import Fetch from "../../js/Fetch";
import SaveTextField from "../Fields/SaveTextField/SaveTextField";
import {inject, observer} from "mobx-react";
import React from "react";
import {List, ListItem, ListSubheader} from "@material-ui/core";
import {emailValidator, phoneValidator} from "../../js/functions/functions";

function ContactsEdit({contacts}) {
  const {email, phone, telegram, setValue} = contacts

  function onSave(data) {
    Fetch.post(['profile', 'contacts'], data).then(setValue)
  }

  return (
    <List dense>
      <ListSubheader disableSticky>Контакты</ListSubheader>
      <ListItem>
        <SaveTextField
          label={'E-mail'}
          name={'email'}
          convertValue={value => value.toLowerCase()}
          validator={emailValidator}
          onSave={onSave}
          defaultValue={email}
        />
      </ListItem>
      <ListItem>
        <SaveTextField
          label={'Телефон'}
          name={'phone'}
          onSave={onSave}
          defaultValue={phone}
          validator={phoneValidator}
        />
      </ListItem>
      <ListItem>
        <SaveTextField
          label={'Telegram'}
          name={'telegram'}
          onSave={onSave}
          defaultValue={telegram}
        />
      </ListItem>
    </List>
  )
}

export default inject(stores => ({
  contacts: stores.UsersStore.getLocalUser().user.contacts
}))(observer(ContactsEdit))
