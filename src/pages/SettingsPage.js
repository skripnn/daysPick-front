import Settings from "../components/Settings/Settings";

function SettingsPage() {

  if (!localStorage.User) return null

  return (
    <>
      <Settings />
    </>
  )
}

export default SettingsPage