import SearchField from "../components/Fields/SearchField/SearchField";
import React, {useEffect, useRef, useState} from "react";
import {IconButton, List,} from "@material-ui/core";
import Calendar from "../components/Calendar";
import {getUsers} from "../js/fetch/users";
import Box from "@material-ui/core/Box";
import Loader from "../js/functions/Loader";
import {DateRange} from "@material-ui/icons";
import UserItem from "../components/UserItem/UserItem";
import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles({
  root: {
    overflow: "hidden",
    transition: "height 500ms ease",
    height: 0
  }
})

export default function SearchPage() {
  const [users, setUsers] = useState(null)
  const [filter, setFilter] = useState(null)
  const [days, setDays] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Loader.clear()
    const search_filter = {}
    if (filter) search_filter.filter = filter
    if (days) search_filter.days = days
    if (filter || days) {
      setLoading(true)
      Loader.set(() => {
        getUsers(search_filter).then((r) => {
          setUsers(r)
          setLoading(false)
        })
      })
    }
    else {
      setLoading(false)
      setUsers(null)
    }
  }, [days, filter])
  const ref = useRef()



  function filterButtonClick() {
    if (ref.current.offsetHeight === 0) {
      ref.current.style.height = `${ ref.current.scrollHeight }px`
    } else {
      ref.current.style.height = "0";
    }
  }

  return (
    <>
      <Box display={'flex'}>
        <SearchField
          onChange={setFilter}
          loading={loading}
        />
        <IconButton onClick={filterButtonClick} size={'small'} >
          <DateRange style={days? {color: '#4db34b'} : undefined}/>
        </IconButton>
      </Box>
      <div ref={ref} className={useStyle().root}>
        <Calendar edit onChange={v => v.length? setDays(v) : setDays(null)} />
      </div>
      {users &&
      <List dense>
        {users.map(user => <UserItem user={user} key={user.username}/>)}
      </List>
      }
    </>
  )
}
