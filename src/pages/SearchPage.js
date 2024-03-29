import React from "react";
import {inject, observer} from "mobx-react";
import A from "../components/core/A";
import mainStore from "../stores/mainStore";
import ProfileItem from "../components/Items/ProfileItem";
import {useAccount} from "../stores/storeHooks";
import {Star} from "@material-ui/icons";
import LazyList from "../components/LazyList/LazyList";


function SearchPage({SearchPage:store}) {
  const {list, page, pages, set, add} = store
  const account = useAccount()

  return (
    <LazyList
      searchFieldParams={{
        set: set,
        placeholder: "Кого искать?",
        autoFocus: true,
        minFilter: 2,
        helperText: 'Введи имя, телефон или специализацию',
        tagsFilter: true
      }}
      add={add}
      page={page}
      pages={pages}
      getLink={'users'}
      getParams={account.id ? {exclude: account.id} : undefined}
    >
      {!!list && list.map(profile =>
        <A link={`@${profile.username}`} setter={mainStore.UserPage.setValue} key={profile.username}>
          <ProfileItem profile={profile} action={account.favorites.includes(profile.id) && <Star color={'secondary'}/>}/>
        </A>
      )}
    </LazyList>
  )
}

export default inject('SearchPage')(observer(SearchPage))
