import Settings from "../components/Settings/Settings";
import Fetch from "../js/Fetch";

function SettingsPage() {

  if (!localStorage.User) Fetch.link('search')

  return (
    <>
      <Settings />
    </>
  )
}

export default SettingsPage
