import {inject, observer} from "mobx-react";
import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagsEdit/TagsEdit";
import React from "react";
import ContactsEdit from "../components/ContactsEdit/ContactsEdit";

function ProfilePage({userStore}) {

  if (!localStorage.User) return null
  if (userStore && userStore.userPage.loading) return null

  return (
    <>
      <PersonalInfo/>
      <ContactsEdit/>
      <TagsEdit/>
    </>
  )
}

export default inject(stores => ({
  userStore: stores.UsersStore.getLocalUser()
}))(observer(ProfilePage))
