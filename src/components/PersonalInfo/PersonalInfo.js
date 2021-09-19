import React from "react";
import {List, ListItem} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import AvatarField from "../Fields/AvatarField/AvatarField";
import {inject, observer} from "mobx-react";
import SaveTextField, {SaveInfoField} from "../Fields/SaveTextField/SaveTextField";

function PersonalInfo({Account:store}) {
  const {first_name, last_name, avatar, full_name, photo, info} = store.profile
  const setValue = (r) => store.setValue({profile: r})

  function onSave(data) {
    Fetch.post(['profile'], data).then(setValue)
  }

  return (
    <List dense>
      <ListItem>
        <AvatarField value={avatar} onChange={setValue} full_name={full_name} photo={photo}/>
      </ListItem>
      <ListItem>
        <SaveTextField
          label={'Имя'}
          name={'first_name'}
          defaultValue={first_name}
          onSave={onSave}
        />
      </ListItem>
      <ListItem>
        <SaveTextField
          label={'Фамилия'}
          name={'last_name'}
          defaultValue={last_name}
          onSave={onSave}
        />
      </ListItem>
      <ListItem>
        <SaveInfoField
          label={'Описание'}
          name={'info'}
          defaultValue={info}
          onSave={onSave}
        />
      </ListItem>
    </List>
  )
}

export default inject('Account')(observer(PersonalInfo))
