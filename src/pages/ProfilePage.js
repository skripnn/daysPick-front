import {inject, observer} from "mobx-react";
import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagEdit/TagsEdit";

function ProfilePage(props) {
  const {
    tags,
    setValue
  } = props.ProfileStore

  if (!localStorage.User) return null

  return (
    <>
      <PersonalInfo/>
      <TagsEdit value={tags} setValue={v => setValue({tags: v})}/>
      {/*<TagsEditOld tags={tags} set={v => setValue({tags: v})}/>*/}
    </>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(ProfilePage))