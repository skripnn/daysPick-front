import {List} from "@material-ui/core";
import React from "react";
import './UserProfile.css'
import {inject, observer} from "mobx-react";
import Tags from "./Tags";
import Contacts from "./Contacts";
import HeaderText from "../Text/HeaderText";
import Tabs from "../Tabs/Tabs";
import ProfileInfo from "./ProfileInfo";

function UserProfile(props) {
  const {user, mobile} = props
  const {activeProfileTab, setValue} = props.userPage

  if (!user) return null

  const showInfo = !!user.info
  const showTags = !!user.tags && !!user.tags.length
  const showContacts = Object.values(user.contacts).find(i => i !== null)

  const tabObj = (id, label, content) => ({
    id: id,
    label: label,
    content: content
  })

  const tabs = []
  if (showInfo) tabs.push(tabObj('Info', 'Описание', <ProfileInfo user={user}/>))
  if (showTags) tabs.push(tabObj('Tags', 'Специализации', <Tags user={user}/>))
  if (showContacts) tabs.push(tabObj('Contacts', 'Контакты', <Contacts user={user}/>))

  if (mobile && tabs.length > 1) {
    return (
      <Tabs
        activeTab={activeProfileTab}
        setActiveTab={v => setValue({activeProfileTab: v})}
        children={tabs}
      />
    )
  }

  return (<List dense>
    {tabs.map(tab => (
      <div key={tab.id}>
        <HeaderText center={mobile}>{tab.label}</HeaderText>
        {tab.content}
      </div>
    ))}
  </List>)
}

export default inject(stores => ({
  user: stores.UsersStore.getUser().user,
  userPage: stores.UsersStore.getUser().userPage
}))(observer(UserProfile))
