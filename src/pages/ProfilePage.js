import {inject, observer} from "mobx-react";
import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagsEdit/TagsEdit";

function ProfilePage(props) {
  const {
    tags,
    setValue,
    first_name,
    last_name,
    email,
    email_confirm,
    phone,
    phone_confirm,
    show_email,
    show_phone,
    avatar,
    full_name,
    photo
  } = props.ProfileStore

  if (!localStorage.User) return null

  return (
    <>
      <PersonalInfo
        first_name={first_name}
        last_name={last_name}
        full_name={full_name}
        show_email={show_email}
        show_phone={show_phone}
        email={email}
        email_confirm={email_confirm}
        phone={phone}
        phone_confirm={phone_confirm}
        setValue={setValue}
        avatar={avatar}
        photo={photo}
      />
      <TagsEdit tags={tags} set={v => setValue({tags: v})}/>
    </>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(ProfilePage))