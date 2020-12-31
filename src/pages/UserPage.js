import React, {useEffect, useState} from "react";
import Calendar from "../components/Calendar/Calendar";
import {ProjectsList} from "../components/ProjectList/ProjectList";
import {getCalendar, getFromUrl, postDaysOff} from "../js/functions/fetch";
import {Hidden} from "@material-ui/core";
import UserFullName from "../components/UserFullName/UserFullName";
import {AccountCircle, EventBusy, List, PostAdd} from "@material-ui/icons";
import UserPageNavigator from "../components/UserPageNavigator/UserPageNavigator";
import {Link} from "react-router-dom";
import NavigatorButton from "../components/NavigatorButton/NavigatorButton";
import UserProfile from "../components/UserProfile/UserProfile";


export default function UserPage() {
  const [state, setState] = useState({
    edit: false,
    profile: false,
    user: {},
    loading: true,
    dayInfo: null,
    dayOffOver: false
  })

  useEffect(() => {
    getFromUrl().then(result => {
      setState(prevState => ({
        ...prevState,
        user: result,
        loading: false,
        profile: result.username !== localStorage.User
      }))
    })
  }, [])


  function changeState(properties, toggle) {
    setState(prevState => {
      let newState = {...prevState, ...properties}
      if (toggle) toggle.forEach((i) => newState[i] = !newState[i])
      return newState
    })
  }

  const buttonsBlock = [
    <NavigatorButton
      key={"Выходные"}
      label={"Выходные"}
      icon={<EventBusy />}
      active={state.edit}
      red={state.dayOffOver}
      onClick={() => changeState({profile: false}, ['edit'])}
    />,
    <Link to={'/project/'} key={"Добавить"} style={{textDecoration: 'none'}}>
      <NavigatorButton
        label={"Добавить"}
        icon={<PostAdd />}
      />
    </Link>,
    <NavigatorButton
      key={"Проекты"}
      label={"Проекты"}
      icon={<List />}
      active={!state.profile}
      onClick={() => changeState({edit: false, profile: false})}
    />,
    <NavigatorButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle />}
      active={state.profile}
      onClick={() => changeState({edit: false, profile: true})}
    />
  ]

  const init = {
    daysOff: state.edit? [] : state.user.daysOff,
    daysPick: state.edit? state.user.daysOff : []
  }

  function dayOver(info, date) {
    if (state.user.daysOff) {
      const dayOffOver = state.user.daysOff.includes(date.format())
      changeState({
        dayOffOver: dayOffOver,
        dayInfo: dayOffOver? (info? info : []) : info
      })
    }
    else changeState({dayInfo: info})
  }

  function closeDayInfo() {
    changeState({dayOffOver: false, dayInfo: null})
  }

  function onChange(daysPick) {
    postDaysOff(daysPick)
    setState(prevState => ({...prevState, user: {...prevState.user, daysOff: daysPick}}))
  }

  if (state.loading) return <></>

  const content = (paddingBottom) => {
    return (
      <div style={{paddingBottom: paddingBottom}}>
        <Calendar
          get={(start, end) => getCalendar(start, end, state.user.username)}
          offset={false}
          edit={state.edit}
          onChange={onChange}
          dayOver={dayOver}
          init={init}
        />
        <div hidden={state.profile}><ProjectsList dayInfo={state.dayInfo} close={closeDayInfo}/></div>
        <div hidden={!state.profile}><UserProfile user={state.user}/></div>
      </div>
    )
  }

  if (state.user.username !== localStorage.User) {
    return (
      <>
        <UserFullName user={state.user}/>
        {content()}
      </>
    )
  }


  return (
    <>
      <Hidden xsDown>
        <UserPageNavigator user={state.user} children={buttonsBlock}/>
        {content()}
      </Hidden>

      <Hidden smUp>
        <UserFullName user={state.user}/>
        <UserPageNavigator children={buttonsBlock} bottom/>
        {content(56)}
      </Hidden>
    </>
  )
}


