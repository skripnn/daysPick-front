import React from "react";
import {List, ListItem} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import AvatarField from "../Fields/AvatarField/AvatarField";
import {inject, observer} from "mobx-react";
import SaveTextField, {SaveInfoField} from "../Fields/SaveTextField/SaveTextField";

function PersonalInfo(props) {
  const {first_name, last_name, setValue, avatar, full_name, photo, info} = props.ProfileStore

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

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(PersonalInfo))
