import Fetch from "../../js/Fetch";
import SaveTextField from "../Fields/SaveTextField/SaveTextField";
import {inject, observer} from "mobx-react";
import React from "react";
import {List, ListItem, ListSubheader} from "@material-ui/core";
import {emailValidator, phoneValidator} from "../../js/functions/functions";

function ContactsEdit({Account:store}) {
  const {email, phone, telegram} = store.profile
  const setValue = (r) => store.setValue({profile: r})

  function onSave(data) {
    Fetch.post(['profile'], data).then(setValue)
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

export default inject('Account')(observer(ContactsEdit))
