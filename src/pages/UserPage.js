import React, {useEffect} from "react";
import Calendar from '../components/Calendar';
import ProjectsList from "../components/ProjectList/ProjectList";
import UserProfile from "../components/UserProfile/UserProfile";
import {getFromUrl} from "../js/fetch/core";
import {postDaysOff} from "../js/fetch/daysOff";
import {getCalendar} from "../js/fetch/calendar";
import {inject, observer} from "mobx-react";
import {getUser} from "../js/functions/functions";
import sortSet from "../components/Calendar/extention/sortSet";


function UserPage(props) {
  const store = props.user.userPage

  useEffect(() => {
    getFromUrl().then(result => {
      props.user.setUser(result)
      if (props.user.userPage.loading) {
        props.user.setValue({
          loading: false,
          profile: result.username !== localStorage.User
        })
      }
    })
  }, [props.user.user.username])


  const content = {
    days: props.user.calendar.content.days,
    daysOff: sortSet(store.edit? [] : props.user.calendar.content.daysOff),
    daysPick: sortSet(store.edit? props.user.calendar.content.daysOff : props.user.userPage.daysPick)
  }

  function showInfo(info, date) {
    if (props.user.user.daysOff) {
      const dayOffOver = props.user.user.daysOff.includes(date.format())
      props.user.setValue({
        dayOffOver: dayOffOver,
        dayInfo: dayOffOver? (info? info : []) : info
      })
    }
    else props.user.setValue({dayInfo: info})
  }

  function onChange(daysPick, date) {
    postDaysOff(date.format())
    props.user.setDaysOff(daysPick)
  }

  if (store.loading) return <></>

  return (
    <div>
      <Calendar
        trigger={props.user.user.username}
        content={content}
        setContent={props.user.calendar.setContent}
        get={(start, end) => getCalendar(start, end, props.user.user.username)}
        offset={false}
        edit={store.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
      />
      <div hidden={store.profile}><ProjectsList history={props.history} actual/></div>
      <div hidden={!store.profile}><UserProfile user={props.user.user}/></div>
    </div>
  )
}

export default inject(stores => {
  return {
    user: stores.UsersStore.getUser(getUser())
  }
})(observer(UserPage))