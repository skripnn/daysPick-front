import {inject, observer} from "mobx-react";
import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagsEdit/TagsEdit";
import React from "react";
import ContactsEdit from "../components/ContactsEdit/ContactsEdit";

function ProfilePage({loading}) {


  if (!localStorage.User) return null
  if (loading) return null

  return (
    <>
      <PersonalInfo/>
      <ContactsEdit/>
      <TagsEdit/>
    </>
  )
}

export default inject(stores => ({
  loading: stores.UsersStore.getLocalUser().userPage.loading
}))(observer(ProfilePage))
