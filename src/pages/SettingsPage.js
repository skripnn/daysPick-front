import Settings from "../components/Settings/Settings";
import Fetch from "../js/Fetch";
import {inject, observer} from "mobx-react";

function SettingsPage({loading}) {

  if (!localStorage.User) Fetch.link('search')
  if (loading) return null

  return (
    <>
      <Settings />
    </>
  )
}

export default inject(stores => ({
  loading: stores.UsersStore.getLocalUser().userPage.loading
}))(observer(SettingsPage))
