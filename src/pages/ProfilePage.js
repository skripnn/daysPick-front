import PersonalInfo from "../components/PersonalInfo/PersonalInfo";
import TagsEdit from "../components/TagsEdit/TagsEdit";
import React from "react";
import ContactsEdit from "../components/ContactsEdit/ContactsEdit";

function ProfilePage() {

  return (
    <>
      <PersonalInfo/>
      <ContactsEdit/>
      <TagsEdit/>
    </>
  )
}

export default ProfilePage
