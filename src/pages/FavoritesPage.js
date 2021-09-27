import LazyList from "../components/LazyList/LazyList";
import A from "../components/core/A";
import mainStore from "../stores/mainStore";
import ProfileItem from "../components/Items/ProfileItem";
import {inject, observer} from "mobx-react";
import React from "react";


function FavoritesPage({FavoritesPage:store}) {
  const {fullList, filteredList} = store
  const {list, page, pages, add} = filteredList.exist() ? filteredList : fullList

  return (
    <LazyList
      searchFieldParams={{
        set: filteredList.set,
      }}
      getLink={'favorites'}
      pages={pages}
      page={page}
      set={fullList.set}
      add={add}
      preLoader
    >
      {!!list && list.map(profile =>
        <A link={`@${profile.username}`} setter={mainStore.UserPage.setValue} key={profile.username}>
          <ProfileItem profile={profile}/>
        </A>
      )}
    </LazyList>
  )
}

export default inject('FavoritesPage')(observer(FavoritesPage))
