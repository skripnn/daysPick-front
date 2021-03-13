import React from "react";
import UserItem from "../components/UserItem/UserItem";
import LazyList from "../components/LazyList/LazyList";
import {inject, observer} from "mobx-react";


function SearchPage(props) {
  const {list, set, add} = props.f


  return (
    <LazyList
      searchFieldParams={{
        set: set,
        placeholder: "Кого искать?",
        autoFocus: true,
        categoryFilter: true,
        minFilter: 3
      }}
      add={add}
      getLink={'users'}
    >
      {list.map(user => <UserItem user={user} key={user.username}/>)}
    </LazyList>
  )
}

export default inject(stores => ({
  f: stores.SearchPageStore.f,
  pageStore: stores.SearchPageStore
}))(observer(SearchPage))