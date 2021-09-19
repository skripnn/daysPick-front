import React from "react";
import LazyList from "../components/LazyList/LazyList";
import {inject, observer} from "mobx-react";
import A from "../components/core/A";
import mainStore from "../stores/mainStore";
import ProfileItem from "../components/Items/ProfileItem";


function SearchPage({SearchPage:store}) {
  const {list, page, pages, set, add} = store

  return (
    <LazyList
      searchFieldParams={{
        set: set,
        placeholder: "Кого искать?",
        autoFocus: true,
        minFilter: 3,
        helperText: 'Введи имя, телефон или специализацию'
      }}
      add={add}
      page={page}
      pages={pages}
      getLink={'users'}
    >
      {!!list && list.map(profile =>
        <A link={`@${profile.username}`} setter={mainStore.UserPage.setValue} key={profile.username}>
          <ProfileItem profile={profile}/>
        </A>
      )}
    </LazyList>
  )
}

export default inject('SearchPage')(observer(SearchPage))
