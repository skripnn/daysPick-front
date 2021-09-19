import TextLoop from "react-text-loop";
import {ProfileAvatar} from "../UserAvatar/UserAvatar";
import React from "react";
import {useMobile} from "../../stores/storeHooks";
import Item from "./Item";

export default function ProfileItem({profile, noTags, ...otherProps}) {
  const mobile = useMobile()
  const tags = profile.tags && profile.tags.length ? (!mobile ?
      <>
        {profile.tags[0].title}
        {profile.tags.length > 1 ? <>, <TextLoop children={profile.tags.slice(1).map(tag => tag.title)}
                                              springConfig={{stiffness: 180, damping: 8}}
                                              className={'text-loop'}/></> : ''}
      </> :
      <TextLoop children={profile.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}}
                className={'text-loop'}/>
  ) : ' '

  return (
    <Item
      avatar={<ProfileAvatar profile={profile}/>}
      primary={profile.full_name}
      secondary={tags}
      {...otherProps}
    />
  )
}
