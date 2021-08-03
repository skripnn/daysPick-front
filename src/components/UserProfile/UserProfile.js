import {List} from "@material-ui/core";
import React from "react";
import './UserProfile.css'
import {inject, observer} from "mobx-react";
import Tags from "./Tags";
import Contacts from "./Contacts";
import HeaderText from "../Text/HeaderText";
import Tabs from "../Tabs/Tabs";

function UserProfile(props) {
  const {user, mobile} = props
  const {activeProfileTab, setValue} = props.userPage

  if (!user) return null

  const showContacts = Object.values(user.contacts).find(i => i !== null)
  const showTags = !!user.tags && !!user.tags.length

  if (mobile && showContacts && showTags) {
    return (
      <Tabs
        activeTab={activeProfileTab}
        setActiveTab={(v) => setValue({activeProfileTab: v})}
      >
        {[
          {
            id: 'Tags',
            label: 'Специализации',
            content: <Tags user={user.tags}/>
          },
          {
            id: 'Contacts',
            label: 'Контакты',
            content: <Contacts user={user}/>
          }
        ]}
      </Tabs>
    )
  }

  return (<List dense>
    {!!showTags &&
    <>
      <HeaderText center={mobile}>Специализации</HeaderText>
      <Tags user={user}/>
    </>
    }
    {!!showContacts &&
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
