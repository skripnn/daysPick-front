import {inject, observer} from "mobx-react";
import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagsEdit/TagsEdit";

function ProfilePage(props) {
  const {tags, setValue, first_name, last_name, email, email_confirm, phone, phone_confirm} = props.ProfileStore

  if (!localStorage.User) return null

  return (
    <>
      <PersonalInfo
        first_name={first_name}
        last_name={last_name}
        email={email}
        email_confirm={email_confirm}
        phone={phone}
        phone_confirm={phone_confirm}
        setValue={setValue}
      />
      <TagsEdit tags={tags} set={v => setValue({tags: v})}/>
    </>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(ProfilePage))