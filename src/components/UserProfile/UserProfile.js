import {List} from "@material-ui/core";
import React from "react";
import './UserProfile.css'
import Box from "@material-ui/core/Box";
import {inject, observer} from "mobx-react";
import Tags from "./Tags";
import Contacts from "./Contacts";
import HeaderText from "../Text/HeaderText";

function UserProfile(props) {
  const {user, mobile} = props
  const {activeProfileTab, setValue} = props.userPage

  const setActiveTab = (v) => setValue({activeProfileTab: v})

  if (!user) return null

  const showContacts = (user.show_email && user.email_confirm) || (user.show_phone && user.phone_confirm)
  const showTags = user.tags.length

  if (mobile && showContacts && showTags) {
    return (
      <List dense>
        <Box display={'flex'} justifyContent={'space-around'}>
          <HeaderText button id={'Tags'} activeTab={activeProfileTab} setTab={setActiveTab}>Специализации</HeaderText>
          <HeaderText button id={'Contacts'} activeTab={activeProfileTab} setTab={setActiveTab}>Контакты</HeaderText>
        </Box>
        {activeProfileTab === 'Tags' && <Tags user={user}/>}
        {activeProfileTab === 'Contacts' && <Contacts user={user}/>}
      </List>
    )
  }

  return (<List dense>
    {showTags &&
    <>
      <HeaderText center={mobile}>Специализации</HeaderText>
      <Tags user={user}/>
    </>
    }
    {showContacts &&
    <>
      <HeaderText center={mobile}>Контакты</HeaderText>
      <Contacts user={user}/>
    </>
    }
  </List>)
}

export default inject(stores => ({
  user: stores.UsersStore.getUser().user,
  userPage: stores.UsersStore.getUser().userPage
}))(observer(UserProfile))
