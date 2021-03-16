import {inject, observer} from "mobx-react";
import Settings from "../components/Settings/Settings";

function SettingsPage(props) {
  const {changeLocalUsername} = props
  const {username, setValue, is_public, phone_confirm} = props.store

  if (!localStorage.User) return null

  return (
    <>
      <Settings
        username={username}
        setValue={setValue}
        is_public={is_public}
        is_public_disabled={!phone_confirm}
        changeLocalUsername={changeLocalUsername}
      />
    </>
  )
}

export default inject(stores => ({
  store: stores.UsersStore.getLocalUser().user,
  changeLocalUsername: stores.UsersStore.changeLocalUsername
}))(observer(SettingsPage))