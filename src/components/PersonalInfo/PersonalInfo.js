import React from "react";
import {
  List,
  ListItem,
} from "@material-ui/core";
import Fetch from "../../js/Fetch";
import AvatarField from "../Fields/AvatarField/AvatarField";
import {inject, observer} from "mobx-react";
import SaveTextField from "../Fields/SaveTextField/SaveTextField";

function PersonalInfo(props) {
  const {first_name, last_name, setValue, avatar, full_name, photo} = props.ProfileStore

  function onSave(data) {
    Fetch.post(['profile'], data).then(setValue)
  }

  return (
    <List dense>
      <ListItem>
        <AvatarField value={avatar} onChange={setValue} full_name={full_name} photo={photo}/>
      </ListItem>
      <SaveTextField
        label={'Имя'}
        name={'first_name'}
        defaultValue={first_name}
        onSave={onSave}
      />
      <SaveTextField
        label={'Фамилия'}
        name={'last_name'}
        defaultValue={last_name}
        onSave={onSave}
      />
    </List>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(PersonalInfo))

